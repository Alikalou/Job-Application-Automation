import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const response = await client.responses.create({
    model: "gpt-5.6-luna",
    input: "Get the title of the example website.",
    tools: [
        {
            type: "function",
            name: "get_page_title",
            description: "Get the title of the example website.",
            parameters: {
                type: "object",
                properties: {},
                required: [],
                additionalProperties: false,
            },
            strict: true,
        },
    ],
    tool_choice: "required",
});

for (const item of response.output) {
    if (item.type === "function_call") {
        console.log("Function call requested:");
        console.log("Name:", item.name);
        console.log("Arguments:", item.arguments);
    }
}

console.log("Response status:", response.status);
