const cheerio = require("cheerio");

function cleanDescription(text) {
  let description = text
    .replace(/\s+/g, " ")
    .trim();

  const startText =
    "It's hard to imagine a world without A Light in the Attic";

  const firstIndex = description.indexOf(startText);

  const secondIndex = description.indexOf(
    startText,
    firstIndex + startText.length
  );

  // If the description contains a duplicated section,
  // keep the complete second copy.
  if (firstIndex !== -1 && secondIndex !== -1) {
    description = description.slice(secondIndex);
  }

  // Remove the website's "...more" marker.
  description = description
    .replace(/\s*\.\.\.more\s*$/i, "")
    .trim();

  return description;
}

function parseBookDescription(html) {
  const $ = cheerio.load(html);

  const description = $("#product_description")
    .next("p")
    .first()
    .text();

  return cleanDescription(description);
}

module.exports = {
  parseBookDescription,
};