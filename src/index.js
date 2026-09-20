import "dotenv/config";

import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

import { authenticateStc } from "./stc/stcAuth.js";
import { getStcJobs } from "./companies/stc.js";
import { parseCv } from "./parseCv.js";
import { applicantDetails } from "../data/applicant.js";
import { matchJob } from "./matchJob.js";
import { applyToStcJob } from "./stc/stcApplicationAgent.js";


const browser = await chromium.launch({
    headless: false,
});

try {
    /*
     * Authenticate with STC.
     */
    const context = await authenticateStc(
        browser
    );

    console.log(
        "1. Authentication finished."
    );


    /*
     * Resolve applicant file paths.
     */
    const cvTextPath = path.join(
        process.cwd(),
        "data",
        "cv.txt"
    );

    const cvPdfPath = path.join(
        process.cwd(),
        "data",
        "cv.pdf"
    );

    const coverLetterPath = path.join(
        process.cwd(),
        "data",
        "cover letter.pdf"
    );


    /*
     * Read and parse CV.
     */
    console.log("2. Reading CV...");

    const cvText = await fs.readFile(
        cvTextPath,
        "utf8"
    );

    console.log(
        "3. CV read successfully."
    );

    console.log(
        "4. Parsing CV with AI..."
    );

    const parsedCv = await parseCv(
        cvText
    );

    console.log(
        "5. CV parsed successfully."
    );


    /*
     * Create applicant object.
     */
    const applicant = {
        cv: parsedCv,
        personal:
            applicantDetails.personal,
        languages:
            applicantDetails.languages,
        stcSpecific:
            applicantDetails.stcSpecific,
        cvPdfPath,
        coverLetterPath,
    };

    console.log(
        "6. Applicant object created."
    );


    /*
     * Fetch STC jobs.
     */
    console.log(
        "7. Fetching STC jobs..."
    );

    const stcJobs = await getStcJobs();

    console.log(
        `8. STC jobs fetched: ${stcJobs.length}`
    );

    if (!stcJobs.length) {
        console.log(
            "No STC jobs found."
        );
    } else {

        /*
         * Match jobs against CV.
         */
        console.log(
            "9. Matching jobs..."
        );

        const matchedJobs = [];

        for (const job of stcJobs) {
            const result = await matchJob(
                applicant.cv,
                job
            );

            if (result.qualified) {
                matchedJobs.push(result);
            }
        }


        /*
         * Highest score first.
         */
        matchedJobs.sort(
            (a, b) =>
                b.score - a.score
        );

        console.log(
            `10. Qualified jobs: ${matchedJobs.length}`
        );

        console.log(matchedJobs);


        /*
         * Limit applications to 5 jobs.
         */
        const jobsToApply =
            matchedJobs.slice(0, 5);

        if (!jobsToApply.length) {
            console.log(
                "No qualified jobs to apply to."
            );
        } else {
            console.log(
                `11. Starting applications for ${jobsToApply.length} job(s)...`
            );


            /*
             * Store results from each
             * application attempt.
             */
            const applicationResults = [];


            /*
             * Apply sequentially.
             *
             * We intentionally don't use
             * Promise.all() here because
             * opening/filling several STC
             * forms simultaneously would make
             * the automation harder to control.
             */
            for (const job of jobsToApply) {

                console.log(
                    "\n--------------------------------"
                );

                console.log(
                    `Starting: ${job.title}`
                );

                console.log(
                    "--------------------------------"
                );

                const result =
                    await applyToStcJob(
                        context,
                        job,
                        applicant,
                        {
                            dryRun: true,
                        }
                    );

                applicationResults.push(
                    result
                );

                console.log(
                    `Finished: ${job.title}`
                );

                console.log(result);
            }


            /*
             * Final run summary.
             */
            console.log(
                "\n12. Application agent finished."
            );

            console.log(
                "Application results:"
            );

            console.log(
                applicationResults
            );
        }
    }

} catch (error) {
    console.error(
        "Application pipeline failed:",
        error
    );

} finally {
    await browser.close();
}