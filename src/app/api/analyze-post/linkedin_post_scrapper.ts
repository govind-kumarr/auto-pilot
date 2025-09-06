import puppeteer from "puppeteer";

async function scrapeLinkedInPost(postUrl: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(postUrl, { waitUntil: "networkidle2" });

  // Extract post text
  const postContent = await page.$eval(
    '[data-test-id="main-feed-activity-card__commentary"]',
    (el) => el.textContent?.trim() || ""
  );

  await browser.close();

  return postContent;
}

export { scrapeLinkedInPost };
