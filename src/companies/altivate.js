import { chromium } from "playwright";

export async function getAltivateJobs() {
    const browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto(
        "https://careers.stc.com.sa/go/All-Jobs-Except-JAP/7754423/?q=&sortColumn=referencedate&sortDirection=desc",
        { waitUntil: "domcontentloaded" }
    );

    const heading = await page.locator("h1").first().textContent();
    console.log(heading);

    await browser.close();
}