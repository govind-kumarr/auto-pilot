import { chromium } from "playwright";

export async function scrapeLinkedInPost(postUrl: string) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.goto(postUrl, { waitUntil: "networkidle" });

    const postContent = await page.$eval(
      '[data-test-id="main-feed-activity-card__commentary"]',
      (el) => el.textContent?.trim() || ""
    );

    return postContent;
  } finally {
    await browser.close();
  }
}
