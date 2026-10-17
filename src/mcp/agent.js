
import OpenAI from "openai";
import { createPlaywrightClient } from "./playwrightClient.js";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Start with a restricted set of browser capabilities.
// We can expand this after the first workflow works.
const ALLOWED_TOOLS = new Set([
    // Navigation and observation
    "browser_navigate",
    "browser_navigate_back",
    "browser_snapshot",
    "browser_wait_for",

    // Form interaction
    "browser_click",
    "browser_fill_form",
    "browser_type",
    "browser_select_option",
    "browser_file_upload",
]);

export async function runBrowserAgent(task, {
    maxIterations = 8,
    browser: existingBrowser,
} = {}) {
    const browser = existingBrowser ?? await createPlaywrightClient();
    const shouldCloseBrowser = !existingBrowser;

    try {
        const { tools } = await browser.listTools();

        // Convert MCP tool definitions to OpenAI function tools.
        const modelTools = tools
            .filter((tool) => ALLOWED_TOOLS.has(tool.name))
            .map((tool) => ({
                type: "function",
                name: tool.name,
                description: tool.description ?? "",
                parameters: tool.inputSchema,
            }));

        if (modelTools.length === 0) {
            throw new Error("No permitted Playwright tools were discovered.");
        }

        // The conversation history must include previous tool calls
        // and their corresponding outputs.
        let input = [
            {
                role: "user",
                content: task,
            },
        ];

        for (let iteration = 0; iteration < maxIterations; iteration++) {
            console.log(`\nAgent iteration ${iteration + 1}`);

            const response = await client.responses.create({
                model: "gpt-5.6-luna",
                instructions: `
You are a browser automation agent.

Use the provided browser tools to accomplish the user's task.
Inspect the page before drawing conclusions.
Do not claim an action succeeded unless its tool result supports that claim.
If you cannot complete the task, explain why.
`,
                input,
                tools: modelTools,
            });

            //We are preparing the request we are going to send to the ai model, and it basically has the type of the model,
            //  along with the isntructions, user task input and the tools accomodating the format of the AI model.

            // Preserve the model's output, including its function calls,
            // before adding the corresponding function-call outputs.
            input.push(...response.output);

            const calls = response.output.filter(
                (item) => item.type === "function_call"
            );

            // No more tool calls means the model has finished.
            if (calls.length === 0) {
                return response.output_text;
            }

            for (const call of calls) {
                if (!ALLOWED_TOOLS.has(call.name)) {
                    throw new Error(
                        `The model requested a disallowed tool: ${call.name}`
                    );
                }

                const args = JSON.parse(call.arguments);

                console.log(`Calling MCP tool: ${call.name}`);
                console.log("Arguments:", args);

                const result = await browser.callTool(call.name, args);

                if (result.isError) {
                    console.error("MCP tool returned an error.");
                }

                input.push({
                    type: "function_call_output",
                    call_id: call.call_id,
                    output: JSON.stringify(result),
                });
            }
        }

        throw new Error(
            `Agent stopped after reaching ${maxIterations} iterations.`
        );
    } finally {
        if (shouldCloseBrowser)
            await existingBrowser.close();
    }
}
