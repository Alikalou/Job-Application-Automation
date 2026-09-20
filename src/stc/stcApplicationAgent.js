import fs from "fs";
import path from "path";

import { handleApplicationForm } from "./stcForm.js";

export async function applyToStcJob(
    context,
    job,
    applicant,
    {
        dryRun = true,
    } = {}
) {
    if (!job?.url) {
        throw new Error("Job URL is missing.");
    }

    if (!applicant?.cvPdfPath) {
        throw new Error(
            "Applicant resume path is missing."
        );
    }

    if (!applicant?.coverLetterPath) {
        throw new Error(
            "Applicant cover letter path is missing."
        );
    }

    const resumePath = path.resolve(
        applicant.cvPdfPath
    );

    const coverLetterPathResolved = path.resolve(
        applicant.coverLetterPath
    );

    if (!fs.existsSync(resumePath) || !fs.existsSync(coverLetterPathResolved)) {
        throw new Error(
            `Make sure that the files you uploaded actually exist.`
        );
    }

    const page = await context.newPage();

    try {
        console.log(
            `Applying to: ${job.title}`
        );

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
         *
         * STC contains more than one identical
         * Apply now link, so explicitly use first().
         */
        const applyButton = page
            .getByRole("link", {
                name: /apply now/i,
            })
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
         * Wait for application page navigation.
         */
        await page.waitForLoadState(
            "domcontentloaded"
        );

        /*
         * Wait until the STC application form
         * has actually appeared.
         */
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
         * Fill applicant fields and upload CV.
         */
        await handleApplicationForm(
            page,
            applicant
        );

        console.log("Application form filling finished.");
        /*
        await page.pause();


        
        //Stop before submitting during development.
         
        if (dryRun) {
            console.log(
                `[DRY RUN] Application prepared for ${job.title}`
            );

            return {
                company: job.company,
                title: job.title,
                url: job.url,
                applied: false,
                status: "dry-run",
                reason:
                    "Application form completed but submission disabled",
            };
        }

        
        //Submit the real application.
         
        const submitButton =
            page.getByRole(
                "button",
                {
                    name:
                        /submit application|apply/i,
                }
            );

        await submitButton.waitFor({
            state: "visible",
            timeout: 200_000,
        });

        await submitButton.click();

        await page.waitForLoadState(
            "domcontentloaded"
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
        */

    } catch (error) {
        return {
            title: job.title,
            applied: false,
            status: "failed",
            reason: error.message,
        };

    } finally {
        await page.close();
    }
}