import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function scrapeLinkedInPost(postUrl: string) {
  const isLambda = process.env.NODE_ENV === "production";

  const executablePath = isLambda
    ? await chromium.executablePath()
    : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.16 Safari/537.36"
    );
    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });
    await page.goto(postUrl, { waitUntil: "networkidle0" });

    const postContent = await page.$eval(
      '[data-test-id="main-feed-activity-card__commentary"]',
      (el) => el.textContent?.trim() || ""
    );

    return postContent;
  } finally {
    await browser.close();
  }
}
