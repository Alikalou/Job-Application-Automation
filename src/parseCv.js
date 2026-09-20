import { askAI } from "./ai.js";

export async function parseCv(cvText) {
  if (!cvText || !cvText.trim()) {
    throw new Error("CV text is empty.");
  }

  const systemPrompt = `
        You are a CV parser.

        Extract only information explicitly present in the CV.
        Do not invent, infer, or add missing information.

        For education:

        - "degree" means only the academic degree level/type,
          such as:
          "Bachelor Degree",
          "Master Degree",
          "Diploma",
          "PhD"

        - "major" means the field of study,
          such as:
          "Computer Engineering",
          "Computer Science",
          "Electrical Engineering"

        Do not combine degree and major.

        Example:

        "Bachelor of Computer Engineering"

        should be returned as:

        {
            "degree": "Bachelor Degree",
            "major": "Computer Engineering"
        }

        Return JSON with exactly this structure:

        {
            "education": [
                {
                    "degree": string | null,
                    "major": string | null,
                    "institution": string | null,
                    "location": string | null,
                    "startDate": string | null,
                    "endDate": string | null,
                    "description": string | null
                }
            ],

            "experience": [
                {
                    "title": string | null,
                    "company": string | null,
                    "location": string | null,
                    "startDate": string | null,
                    "endDate": string | null,
                    "responsibilities": string[]
                }
            ],

            "skills": string[],
        }

        If a field is not present, use null or an empty array.
    `;

  return askAI(
    systemPrompt,
    cvText
  );
}