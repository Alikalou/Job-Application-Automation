import "dotenv/config";

import fs from "fs/promises";
import path from "path";
import { chromium } from "playwright";

import { authenticateStc } from "./stc/stcAuth.js";
import { authenticate } from "./auth.js";
import { getStcJobs } from "./companies/stc.js";
import { parseCv } from "./parseCv.js";
import { applicantDetails } from "../data/applicant.js";
import { matchJob } from "./matchJob.js";
import { applyToStcJob } from "./stc/stcApplicationAgent.js";
import { handleCandidateProfile } from "./stc/stcForm.js";
import { generateCoverLetter } from "./coverLetter.js";
import { saveRunLog, buildRunLog } from "./logging.js";

const browser = await chromium.launch({
    headless: false,
});

try {
    /*
     * Authenticate with STC.
     */
    /*
    const context = await authenticateStc(
        browser
    );*/
    const aramcoUrl = "https://career-sa20.hr.cloud.sap/career?company=saudiara05&site=VjItRGhPbyt6YkR2WW9wWVZVL2xmT29ZZz09&lang=en_US&login_ns=login&loginFlowRequired=true";
    const authPath = "./data/aramco-auth.json";
    const context =
        await authenticate(
            browser,
            {
                company: "Aramco",
                loginUrl: aramcoUrl,
                authPath,
            }
        );

    const page = context.pages()[0];

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
        personal: applicantDetails.personal,
        languages: applicantDetails.languages,
        stcSpecific: applicantDetails.stcSpecific,
        cvPdfPath,
    };

    console.log(
        "6. Applicant object created."
    );

    console.log("Filling Candidate Profile...");

    await handleCandidateProfile(page, applicant);

    console.log("Filled Candidate Profile");

    /*
     * Fetch STC jobs.
     */
    console.log("7. Fetching STC jobs...");

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
            console.log("No qualified jobs to apply to.");
        } else {
            console.log(`11. Starting applications for ${jobsToApply.length} job(s)...`);


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

                console.log("JOB SENT TO GENERATOR:");


                const coverLetter = await generateCoverLetter(applicant, job);

                const application = { job, coverLetter }


                const result = await applyToStcJob(context, applicant, application);

                applicationResults.push(result);

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

            const runLog = buildRunLog(
                "STC",
                stcJobs,
                matchedJobs,
                jobsToApply,
                applicationResults
            );

            await saveRunLog(runLog);

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