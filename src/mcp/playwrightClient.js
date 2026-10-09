
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

export async function createPlaywrightClient() {
    const client = new Client({
        name: "job-application-agent",
        version: "1.0.0",
    });

    const transport = new StdioClientTransport({
        command: "npx",
        args: ["-y", "@playwright/mcp@latest"],
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
