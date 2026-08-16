# FlyRank Week 5 – Polite Book Scraper

A small, polite web scraper built with Node.js that collects book data from
Books to Scrape, normalizes the scraped values, validates the records using
Zod, handles failures gracefully, caches downloaded pages, and saves the final
data as clean JSON.

## Features

- Scrapes 3 catalogue pages
- Collects 60 books
- Extracts:
  - Title
  - Product URL
  - Price
  - Availability
  - Rating
  - Description
  - Source catalogue page
- Converts prices such as `£51.77` into numbers such as `51.77`
- Converts star ratings into numeric values
- Uses local caching to avoid unnecessary repeated requests
- Uses a polite delay between requests
- Uses a custom User-Agent through the fetcher
- Validates scraped records with Zod
- Detects duplicate product URLs
- Checks for missing descriptions
- Handles detail-page failures without stopping the entire scraper
- Saves the final validated records as JSON

## Tech Stack

- Node.js
- JavaScript
- Cheerio
- Zod

## Project Structure

```text
flyrank-week5-polite-scraper/
│
├── scraper/
│   ├── output/
│   │   └── books.json
│   │
│   ├── src/
│   │   ├── cacheKey.js
│   │   ├── delay.js
│   │   ├── detailParser.js
│   │   ├── fetcher.js
│   │   ├── index.js
│   │   ├── parser.js
│   │   └── schema.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md