import { createPlaywrightClient } from "../mcp/playwrightClient.js";

const browser = await createPlaywrightClient();

try {
    const { tools } = await browser.listTools();
    const toolNames = [
        "browser_snapshot",
        "browser_fill_form",
        "browser_type",
        "browser_click",
    ];

    for (const name of toolNames) {
        const tool = tools.find((item) => item.name === name);

        console.log(`\n--- ${name} ---`);
        if (tool) {
            console.dir(tool.inputSchema, { depth: null });
        } else {
            console.log("Tool not found.");
        }
    }


    console.log(`Found ${tools.length} Playwright MCP tools:\n`);

    for (const tool of tools) {
        console.log(`- ${tool.name}: ${tool.description ?? ""}`);
    }
} finally {
    await browser.close();
}