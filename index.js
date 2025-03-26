const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // Launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Go to Hacker News newest page
  await page.goto("https://news.ycombinator.com/newest");

  // Wait for articles to load
  await page.waitForSelector(".athing");

  // Extract timestamps for the first 100 articles
  const articles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".athing"))
      .slice(0, 100)
      .map(article => {
        const ageLink = article.nextElementSibling?.querySelector(".age a");
        return ageLink ? ageLink.getAttribute("href") : null;
      })
      .filter(Boolean);
  });

  // Extract timestamps as numeric values
  const timestamps = articles.map(url => {
    const match = url.match(/item\?id=(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }).filter(Boolean);

  // Validate sorting from newest to oldest
  const isSorted = timestamps.every((val, i, arr) => i === 0 || arr[i - 1] >= val);

  if (isSorted) {
    console.log("✅ The first 100 articles are sorted from newest to oldest.");
  } else {
    console.log("❌ The articles are NOT sorted correctly.");
  }

  // Close browser
  await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
