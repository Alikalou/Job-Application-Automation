import fs from "fs/promises";
import path from "path";

const LOG_PATH = path.resolve(
    "data",
    "application-logs.json"
);

export async function saveRunLog(runLog) {
    let logs = [];

    try {
        const existingData =
            await fs.readFile(LOG_PATH, "utf8");

        logs = JSON.parse(existingData);
    } catch (error) {
        if (error.code !== "ENOENT") {
            throw error;
        }
    }

    logs.push(runLog);

    await fs.mkdir(
        path.dirname(LOG_PATH),
        { recursive: true }
    );

    await fs.writeFile(
        LOG_PATH,
        JSON.stringify(logs, null, 2),
        "utf8"
    );

    console.log("Application run logged.");
}

export function buildRunLog(
    company,
    jobs,
    matchedJobs,
    jobsToApply,
    applicationResults
) {
    return {
        timestamp: new Date().toISOString(),
        company,

        jobsFound: jobs.length,
        jobsQualified: jobsToApply.length,

        jobs: matchedJobs.map(job => {
            const application =
                applicationResults.find(
                    result =>
                        result.url === job.url
                );

            return {
                title: job.title,
                url: job.url,
                score: job.score,
                qualified: job.qualified,
                matchingReason: job.reason,

                applied:
                    application?.applied ?? false,

                submissionStatus:
                    application?.status ??
                    "not_attempted",

                ...(application?.reason &&
                    application.status !== "submitted"
                    ? {
                        submissionReason:
                            application.reason,
                    }
                    : {}),
            };
        }),
    };
}