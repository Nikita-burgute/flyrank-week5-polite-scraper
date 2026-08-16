const fs = require("fs/promises");
const path = require("path");

const USER_AGENT =
  "FlyRankInternship-A9/1.0 (+https://github.com/Nikita-burgute/flyrank-week5-polite-scraper)";

const TIMEOUT_MS = 10000;

async function fetchAndCache(url, cacheFile) {
  const cachePath = path.join(__dirname, "..", "cache", cacheFile);

  // Check cache first
  try {
    const cachedHtml = await fs.readFile(cachePath, "utf-8");

    console.log(`CACHE HIT ${cacheFile}`);
    console.log(`size=${Buffer.byteLength(cachedHtml, "utf-8")} bytes`);

    return {
      html: cachedHtml,
      fromCache: true,
      status: 200,
    };
  } catch (error) {
    // Cache file does not exist, so fetch from the website.
  }

  console.log(`FETCH ${url}`);

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      signal: controller.signal,
    });

    // Only HTTP 200 is considered successful.
    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Save the fetched HTML in cache.
    await fs.writeFile(cachePath, html, "utf-8");

    console.log(`status=${response.status}`);
    console.log(`size=${Buffer.byteLength(html, "utf-8")} bytes`);
    console.log(`Saved ${cacheFile}`);

    return {
      html,
      fromCache: false,
      status: response.status,
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  fetchAndCache,
};