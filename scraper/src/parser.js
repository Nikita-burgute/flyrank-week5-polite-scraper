const cheerio = require("cheerio");

function normalizePrice(priceText) {
  const cleaned = priceText.replace("£", "").trim();
  const price = Number.parseFloat(cleaned);

  if (!Number.isFinite(price)) {
    throw new Error(`Invalid price: ${priceText}`);
  }

  return price;
}

function normalizeAvailability(availabilityText) {
  return availabilityText
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeRating(ratingClass) {
  const ratingMap = {
    One: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
  };

  const ratingWord = ratingClass
    .split(/\s+/)
    .find((value) => ratingMap[value] !== undefined);

  return ratingWord ? ratingMap[ratingWord] : null;
}

function parseCataloguePage(html, sourceUrl) {
  const $ = cheerio.load(html);

  const books = [];

  $(".product_pod").each((index, element) => {
    const titleElement = $(element).find("h3 a");

    const title = titleElement.attr("title")?.trim() || "";

    const relativeUrl = titleElement.attr("href") || "";

    const productUrl = new URL(relativeUrl, sourceUrl).href;

    const priceText = $(element)
      .find(".price_color")
      .text()
      .trim();

    const availabilityText = $(element)
      .find(".availability")
      .text();

    const ratingClass =
      $(element).find(".star-rating").attr("class") || "";

    const price = normalizePrice(priceText);

    const availability =
      normalizeAvailability(availabilityText);

    const rating = normalizeRating(ratingClass);

    books.push({
      title,
      productUrl,
      price,
      availability,
      rating,
      sourceCataloguePage: sourceUrl,
    });
  });

  return books;
}

module.exports = {
  parseCataloguePage,
};