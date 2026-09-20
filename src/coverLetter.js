import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import PDFDocument from "pdfkit";
import { askAI } from "./ai.js";

function sanitizeFileName(value) {
    return value
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
}

export async function generateCoverLetter(
    applicant,
    job
) {

    let coverLetter;

    for (let attempt = 0; attempt <= 1; attempt++) {
        const response =
            await generateWithAi(
                applicant.cv,
                job
            );

        console.log(
            "Cover letter response:",
            response
        );

        console.log(
            "Response type:",
            typeof response
        );

        try {

            coverLetter = validateCoverLetter(response);
            break;
        } catch (error) {
            if (attempt === 2) {
                throw error;
            }

            console.log(
                "Invalid cover letter structure. Retrying..."
            );
        }
    }

    const pdfPath =
        await createCoverLetterPdf(
            coverLetter,
            job.title
        );

    if (!fs.existsSync(pdfPath)) {
        throw new Error(
            "Cover letter PDF was not created."
        );
    }

    return pdfPath;
}
/*
 * Ask the AI to generate a tailored
 * cover letter from the applicant's CV
 * and the current job posting.
 */
async function generateWithAi(
    cv,
    job
) {
    const systemPrompt = `
    You are generating a professional cover letter
    for a job application.

    Use only information explicitly present in the
    candidate CV. Do not invent experience, skills,
    qualifications, achievements, or personal details.

    Carefully analyze the job description and generate
    a cover letter that is specifically adapted to it.

    Identify the responsibilities, skills, qualifications,
    and experience emphasized in the job description.
    Then highlight the candidate's most relevant experience,
    skills, education, and projects that correspond to those
    requirements.

    Do not simply summarize the candidate's CV. Prioritize
    information that makes the candidate relevant to this
    particular position.

    If the candidate does not have an exact qualification
    requested by the job, do not claim that they do.
    Instead, mention related experience or transferable
    skills only when they are explicitly supported by the CV.

    Keep the letter concise, natural, and professional.

    Return ONLY valid JSON in this format:

    {
        "greeting": "Dear Hiring Manager,",
        "paragraphs": [
            "First paragraph...",
            "Second paragraph...",
            "Third paragraph..."
        ],
        "closing": "Sincerely,"
    }
`;
    const userPrompt = `
        Generate a tailored cover letter for the following
        candidate and job.

        CANDIDATE CV:
        ${JSON.stringify(cv, null, 2)}

        JOB:
        ${JSON.stringify(job, null, 2)}
        `;


    const response = askAI(systemPrompt, userPrompt);

    return response;
}


/*
 * Convert the AI JSON response into
 * a JavaScript object and validate the
 * fields required for PDF generation.
 */
function validateCoverLetter(
    coverLetter
) {
    if (
        !coverLetter ||
        typeof coverLetter !== "object" ||
        !coverLetter.greeting ||
        !Array.isArray(
            coverLetter.paragraphs
        ) ||
        !coverLetter.paragraphs.length ||
        !coverLetter.closing
    ) {
        throw new Error("AI returned an invalid cover letter structure.");
    }

    return coverLetter;
}


async function createCoverLetterPdf(
    coverLetter,
    jobTitle
) {
    const outputDirectory = path.join(
        process.cwd(),
        "data",
        "generated"
    );

    await fsPromises.mkdir(
        outputDirectory,
        { recursive: true }
    );

    const safeTitle =
        sanitizeFileName(
            jobTitle || "empty-title"
        );

    const pdfPath = path.join(
        outputDirectory,
        `cover-letter-${safeTitle}.pdf`
    );

    const doc = new PDFDocument({
        size: "A4",
        margin: 60,
    });

    const stream =
        fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    doc.fontSize(11).text(coverLetter.greeting);

    doc.moveDown();

    for (
        const paragraph
        of coverLetter.paragraphs
    ) {
        doc.text(paragraph, {
            lineGap: 3,
        });

        doc.moveDown();
    }

    doc.text(coverLetter.closing);

    doc.end();

    await new Promise(
        (resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        }
    );

    return pdfPath;
}