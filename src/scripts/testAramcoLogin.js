import dotenv from "dotenv";

dotenv.config({
    path: "D:/job-application-agent/.env",
});

import { createPlaywrightClient } from "../mcp/playwrightClient.js";
import { authenticateAramco } from "../mcp/authenticateAramco.js";

const browser = await createPlaywrightClient();

try {
    await authenticateAramco(browser);

    console.log("Authentication flow finished.");
    console.log("Inspect the resulting page to confirm login status.");
} catch (error) {
    console.error("Authentication failed:", error.message);
    process.exitCode = 1;
} finally {
    await browser.close();
}