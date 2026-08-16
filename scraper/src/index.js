const { fetchAndCache } = require("./fetcher");

const CATALOGUE_PAGE_1 =
  "https://books.toscrape.com/catalogue/page-1.html";

async function main() {
  try {
    await fetchAndCache(
      CATALOGUE_PAGE_1,
      "catalogue-page-1.html"
    );

    console.log("Stage 1 fetch completed.");
  } catch (error) {
    console.error(`Fetch failed: ${error.message}`);
  }
}

main();