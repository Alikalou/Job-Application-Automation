import fs from "fs/promises";

async function authFileExists(authPath) {
    try {
        await fs.access(authPath);
        return true;
    } catch {
        return false;
    }
}

export async function authenticate(
    browser,
    {
        company,
        loginUrl,
        authPath,
    }
) {
    const hasSavedSession =
        await authFileExists(authPath);

    const context = await browser.newContext(
        hasSavedSession
            ? {
                storageState: authPath,
            }
            : {}
    );

    const page = await context.newPage();

    await page.goto(loginUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
    });

    console.log(
        hasSavedSession
            ? `Checking saved ${company} session...`
            : `No saved ${company} session. Please sign in...`
    );

    if (page.url().includes("login")) {
        console.log(
            `Waiting for successful ${company} login...`
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

    console.log(
        `${company} authentication successful.`
    );

    await context.storageState({
        path: authPath,
    });

    return context;
}