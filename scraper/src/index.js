const fs = require("fs/promises");
const path = require("path");

const { fetchAndCache } = require("./fetcher");
const { parseCataloguePage } = require("./parser");
const { parseBookDescription } = require("./detailParser");
const { randomDelay } = require("./delay");
const { createDetailCacheFile } = require("./cacheKey");
const { BooksSchema } = require("./schema");

const CATALOGUE_PAGE_URLS = [
  "https://books.toscrape.com/catalogue/page-1.html",
  "https://books.toscrape.com/catalogue/page-2.html",
  "https://books.toscrape.com/catalogue/page-3.html",
];

async function main() {
  try {
    // ============================================
    // STEP 1: Collect books from all 3 catalogue pages
    // ============================================

    const allBooks = [];
    const errors = [];

    for (
      let pageIndex = 0;
      pageIndex < CATALOGUE_PAGE_URLS.length;
      pageIndex++
    ) {
      const catalogueUrl = CATALOGUE_PAGE_URLS[pageIndex];
      const pageNumber = pageIndex + 1;

      console.log(
        `\n========== Catalogue Page ${pageNumber} ==========`
      );

      // Fetch catalogue page from cache or website
      const catalogueResult = await fetchAndCache(
        catalogueUrl,
        `catalogue-page-${pageNumber}.html`
      );

      // Parse books from catalogue page
      const books = parseCataloguePage(
        catalogueResult.html,
        catalogueUrl
      );

      console.log(
        `Parsed books from page ${pageNumber}: ${books.length}`
      );

      // Add books to the main array
      allBooks.push(...books);
    }

    console.log(
      `\nTotal catalogue books: ${allBooks.length}`
    );

    // ============================================
    // STEP 2: Process all book detail pages
    // ============================================

    console.log(
      "\n========== Processing Detail Pages =========="
    );

    for (let i = 0; i < allBooks.length; i++) {
      const book = allBooks[i];

      console.log(
        `\nProcessing detail ${i + 1}/${allBooks.length}: ${book.title}`
      );

      try {
        // Create stable cache filename
        const cacheFile = createDetailCacheFile(
          book.productUrl
        );

        // Fetch detail page from cache or website
        const detailResult = await fetchAndCache(
          book.productUrl,
          cacheFile
        );

        // Extract description
        book.description = parseBookDescription(
          detailResult.html
        );

        console.log("Description extracted.");
      } catch (error) {
        console.error(
          `Failed to process "${book.title}": ${error.message}`
        );

        errors.push({
          title: book.title,
          productUrl: book.productUrl,
          error: error.message,
        });
      }

      // Always wait before the next request
      if (i < allBooks.length - 1) {
        console.log(
          "Waiting politely before next request..."
        );

        await randomDelay(1000, 2000);
      }
    }

    console.log(
      `\nAll ${allBooks.length} detail pages processed.`
    );

    console.log(
      `Successful records: ${allBooks.length - errors.length}`
    );

    console.log(
      `Failed records: ${errors.length}`
    );

    if (errors.length > 0) {
      console.log("\nErrors encountered:");

      console.dir(errors, {
        depth: null,
      });
    }

    // ============================================
    // STEP 3: Duplicate check
    // ============================================

    const productUrls = allBooks.map(
      (book) => book.productUrl
    );

    const uniqueProductUrls = new Set(productUrls);

    const duplicateCount =
      productUrls.length - uniqueProductUrls.size;

    console.log(
      "\n========== Data Quality Check =========="
    );

    console.log(
      `Total records: ${allBooks.length}`
    );

    console.log(
      `Unique product URLs: ${uniqueProductUrls.size}`
    );

    console.log(
      `Duplicate records: ${duplicateCount}`
    );

    if (duplicateCount > 0) {
      console.warn(
        `WARNING: ${duplicateCount} duplicate record(s) found.`
      );
    } else {
      console.log("No duplicate books found.");
    }

    // ============================================
    // STEP 4: Missing description check
    // ============================================

    const booksWithoutDescription = allBooks.filter(
      (book) =>
        !book.description ||
        book.description.trim().length === 0
    );

    console.log(
      `Books without description: ${booksWithoutDescription.length}`
    );

    if (booksWithoutDescription.length > 0) {
      console.warn(
        "WARNING: Some books are missing descriptions."
      );

      console.dir(
        booksWithoutDescription,
        {
          depth: null,
        }
      );
    } else {
      console.log(
        "All books have a non-empty description."
      );
    }

    // ============================================
    // STEP 5: Zod validation
    // ============================================

    const validationResult =
      BooksSchema.safeParse(allBooks);

    if (!validationResult.success) {
      console.error("\nValidation failed:");

      console.error(
        validationResult.error.issues
      );

      process.exitCode = 1;
      return;
    }

    console.log("\n=================================");
    console.log("Validation passed.");
    console.log(
      `Valid records: ${validationResult.data.length}`
    );
    console.log("=================================");

    // ============================================
    // STEP 6: Create output directory
    // ============================================

    const outputDirectory = path.join(
      __dirname,
      "..",
      "output"
    );

    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    // ============================================
    // STEP 7: Save final JSON
    // ============================================

    const outputPath = path.join(
      outputDirectory,
      "books.json"
    );

    await fs.writeFile(
      outputPath,
      JSON.stringify(
        validationResult.data,
        null,
        2
      ),
      "utf-8"
    );

    console.log(
      `JSON saved to: ${outputPath}`
    );

    // ============================================
    // STEP 8: Final summary
    // ============================================

    console.log(
      "\n================================="
    );
    console.log(
      "SCRAPING COMPLETED SUCCESSFULLY"
    );
    console.log(
      "================================="
    );

    console.log(
      `Catalogue pages: ${CATALOGUE_PAGE_URLS.length}`
    );

    console.log(
      `Total books: ${validationResult.data.length}`
    );

    console.log(
      `Successful records: ${allBooks.length - errors.length}`
    );

    console.log(
      `Failed records: ${errors.length}`
    );

    console.log(
      `Duplicate records: ${duplicateCount}`
    );

    console.log(
      `Books without description: ${booksWithoutDescription.length}`
    );

    console.log("Validation: PASSED");

    console.log(
      "Output: output/books.json"
    );

    console.log(
      "================================="
    );
  } catch (error) {
    console.error(
      `Scraper failed: ${error.message}`
    );

    process.exitCode = 1;
  }
}

main();