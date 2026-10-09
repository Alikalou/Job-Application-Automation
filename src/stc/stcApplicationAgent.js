import { handleApplicationForm } from "./stcForm.js";

export async function applyToStcJob(
    context,
    applicant,
    application
) {
    const {
        job,
        coverLetter,
    } = application;

    /*
     * Validate application data.
     */
    if (!job?.url) {
        throw new Error(
            "Job URL is missing."
        );
    }

    /*
     * Open a dedicated page for this
     * application.
     */
    const page = await context.newPage();

    try {
        console.log(`Applying to: ${job.title}`);

        /*
         * Open STC job page.
         */
        await page.goto(
            job.url,
            {
                waitUntil:
                    "domcontentloaded",
                timeout: 60_000,
            }
        );


        /*
         * Click Apply now.
         */
        const applyButton = page
            .getByRole(
                "link",
                {
                    name: /apply now/i,
                }
            )
            .first();

        await applyButton.waitFor({
            state: "visible",
            timeout: 15_000,
        });

        console.log(
            "Found Apply now button."
        );

        await applyButton.click();

        console.log(
            "Clicked Apply now button."
        );


        /*
         * Wait for application form.
         */
        await page.waitForLoadState(
            "domcontentloaded"
        );

        await page
            .getByText(
                "My Documents",
                {
                    exact: true,
                }
            )
            .waitFor({
                state: "visible",
                timeout: 15_000,
            });

        console.log(
            "Application form loaded."
        );

        /*
         * Fill only application-specific
         * information.
         *
         * Candidate profile information has
         * already been filled before retrieving
         * and evaluating jobs.
         */
        await handleApplicationForm(
            page,
            applicant,
            coverLetter
        );

        console.log(
            "Application form filling finished."
        );


        return {
            company: job.company,
            title: job.title,
            url: job.url,
            applied: true,
            status: "submitted",
            reason:
                "Application successfully submitted",
        };

    } catch (error) {
        return {
            company: job.company,
            title: job.title,
            url: job.url,
            applied: false,
            status: "failed",
            reason: error.message,
        };

    } finally {
        await page.close();
    }
}