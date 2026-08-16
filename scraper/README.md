# FlyRank Week 5 - Polite Web Scraper

## Target Classification

### Target

Books to Scrape

URL:

https://books.toscrape.com/

Books to Scrape is a demo website intended for web scraping practice.
The website itself states that it is a demo website for web scraping
purposes.

### Robots.txt Check

Checked URL:

https://books.toscrape.com/robots.txt

Observed result:

404 Not Found

The target did not provide a robots.txt file at the checked location.
This result is recorded as observed rather than assuming any additional
robots policy.

### Scraping Scope

This project will collect data from:

- The first 3 catalogue pages
- 60 unique books in total
- Individual book detail pages linked from those catalogue pages

### Data to Collect

For each book, the scraper will collect:

- title
- product URL
- price
- availability
- rating
- description
- source catalogue page
- fetched timestamp

### Politeness

The scraper will:

- Identify itself with a descriptive User-Agent
- Use a request timeout
- Wait at least 500 ms between real requests
- Cache fetched HTML during development
- Avoid unnecessary repeated requests
- Handle failures without crashing the complete run

### Ethics

This scraper is intended only for the specified practice website.

When scraping other websites, I will check the site's rules and terms
first. I will prefer an official API when one exists, never bypass
authentication or paywalls, never bypass access blocks, and collect
only the data that is necessary for the task.