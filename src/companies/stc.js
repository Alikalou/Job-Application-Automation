import { chromium } from "playwright";
import dotenv from "dotenv";
dotenv.config();

const STC_BASE_URL = process.env.STC_BASE_URL;

const FIRST_PAGE_URL = `${STC_BASE_URL}${process.env.STC_JOBS_PATH}`;

const relevantTitles = [
    "software",
    "backend",
    "developer",
    "engineer",
    "application",
    "web",
    "full stack",
    "database",
    "Security Design & Implementation Expert",
    "Data science",
    "Medical Insurance",
    "Succession Planning"
];


function filterJobsByTitle(jobs) {
    return jobs.filter(job => {
        const title = job.title.toLowerCase();

        return relevantTitles.some(keyword =>
            title.includes(keyword.toLowerCase())
        );
    });
}

export async function getStcJobs() {
    const browser = await chromium.launch();

    try {
        const page = await browser.newPage();
        const jobs = [];

        let currentUrl = FIRST_PAGE_URL;

        while (currentUrl) {
            await page.goto(currentUrl, {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });

            const rows = page.locator("tr.data-row");
            const count = await rows.count();

            for (let i = 0; i < count; i++) {
                const row = rows.nth(i);

                const titleElement = row.locator(
                    ".colTitle .jobTitle.hidden-phone .jobTitle-link"
                );

                const title = await titleElement.innerText();
                const href = await titleElement.getAttribute("href");

                const location = await row
                    .locator(".colLocation .jobLocation")
                    .innerText();

                const facility = await row
                    .locator(".colFacility .jobFacility")
                    .innerText();

                const date = await row
                    .locator(".colDate .jobDate")
                    .innerText();

                jobs.push({
                    company: "STC",
                    title: title.trim(),
                    location: location.trim(),
                    facility: facility.trim(),
                    postedDate: date.trim(),
                    description: null,
                    url: new URL(href, BASE_URL).href,
                });
            }

            const currentPage = page
                .locator(".pagination .current-page")
                .first();

            if (await currentPage.count() === 0) {
                // No pagination means all jobs fit on one page
                currentUrl = null;
                continue;
            }

            const currentPageNumber = Number(
                await currentPage.innerText()
            );

            const nextPage = page
                .locator(
                    `.pagination a[title="Page ${currentPageNumber + 1}"]`
                )
                .first();

            if (await nextPage.count() === 0) {
                currentUrl = null;
            } else {
                const nextHref =
                    await nextPage.getAttribute("href");

                currentUrl =
                    new URL(nextHref, BASE_URL).href;
            }
        }

        //After fetching all job offers, go over each individual page and look for the jobDescription selector
        const filteredJobs = await filterJobsByTitle(jobs)

        for (const job of filteredJobs) {
            await page.goto(job.url, {
                waitUntil: "domcontentloaded",
                timeout: 60000,
            });

            const description = await page
                .locator(".jobdescription")
                .innerText();

            job.description = description.trim();
        }
        return filteredJobs;

    } finally {
        await browser.close();
    }
}