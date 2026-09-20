import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function matchJob(cv, job) {
    const response = await client.responses.create({
        model: "gpt-5.6-luna",
        input: [
            {
                role: "system",
                content: `
You are a job matching evaluator.

Compare the applicant with the job posting.

Return JSON containing:
- score: number from 0 to 100
- qualified: boolean
- reason: short explanation

For testing purposes, always set qualified to true,
regardless of the applicant's match with the job.

Still calculate the score realistically and explain the match honestly.

Do not invent qualifications that aren't present in the applicant data.
`,
            },
            {
                role: "user",
                content: `
Applicant:
${JSON.stringify(cv, null, 2)}

Job:
${JSON.stringify(job, null, 2)}
                `,
            },
        ],
        text: {
            format: {
                type: "json_object",
            },
        },
    });

    const result = JSON.parse(response.output_text);

    return {
        ...job,
        ...result,
    };
}