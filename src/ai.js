import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function askAI(systemPrompt, userPrompt) {
    const response = await client.responses.create({
        model: "gpt-5.6-luna",

        input: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],

        text: {
            format: {
                type: "json_object",
            },
        },
    });

    return JSON.parse(response.output_text);
}