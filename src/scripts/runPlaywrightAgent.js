import "dotenv/config";
import { runBrowserAgent } from "../mcp/agent.js";

const task = process.argv.slice(2).join(" ");

if (!task) {
    console.error(
        'Usage: node src/scripts/runPlaywrightAgent.js "Your browser task"'
    );
    process.exitCode = 1;
} else {
    try {
        const answer = await runBrowserAgent(task);

        console.log("\nFinal answer:\n");
        console.log(answer);
    } catch (error) {
        console.error("\nAgent failed:", error);
        process.exitCode = 1;
    }
}
