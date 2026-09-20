import fs from "fs/promises";

const AUTH_PATH = "./data/stc-auth.json";

const LOGIN_URL =
    "https://career-sa20.hr.cloud.sap/career?company=stc&site=&lang=en_US&login_ns=login&loginFlowRequired=true";

async function authFileExists() {
    try {
        await fs.access(AUTH_PATH);
        return true;
    } catch {
        return false;
    }
}

export async function authenticateStc(browser) {
    const hasSavedSession =
        await authFileExists();

    const context = await browser.newContext(
        hasSavedSession
            ? {
                storageState: AUTH_PATH,
            }
            : {}
    );

    const page = await context.newPage();

    await page.goto(LOGIN_URL, {
        waitUntil: "domcontentloaded",
        timeout: 60_000,
    });

    console.log(
        hasSavedSession
            ? "Checking saved STC session..."
            : "No saved STC session. Please sign in..."
    );

    /*
     * If the saved session is valid, STC should redirect away
     * from the login flow.
     *
     * If it isn't valid, manually sign in.
     * Once STC redirects after successful authentication,
     * execution continues automatically.
     */
    if (page.url().includes("login")) {
        console.log(
            "Waiting for successful STC login..."
        );

        await page.waitForURL(
            url =>
                !url.href.includes(
                    "loginFlowRequired=true"
                ),
            {
                timeout: 0,
            }
        );
    }

    console.log("STC authentication successful.");

    await context.storageState({
        path: AUTH_PATH,
    });

    await page.close();

    return context;
}