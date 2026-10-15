
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

export async function createPlaywrightClient() {
    const client = new Client({
        name: "job-application-agent",
        version: "1.0.0",
    });

    //The communication can be done here over the standard input/output library or using HTTP.
    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y",
            "@playwright/mcp@latest",
            "--timeout-action=30000",
            "--timeout-navigation=60000",
            "--timeout-settle=1000"],
        stderr: "inherit",
    });

    try {
        await client.connect(transport);
    } catch (error) {
        await client.close().catch(() => { });
        throw error;
    }

    return {
        listTools() {
            return client.listTools();
        },

        callTool(name, args) {
            return client.callTool({
                name,
                arguments: args,
            });
        },

        async close() {
            await client.close();
        },
    };
}
