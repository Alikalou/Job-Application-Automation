export async function authenticateAramco(browser) {
    const {
        ARAMCO_LOGIN_URL,
        ARAMCO_EMAIL,
        ARAMCO_PASSWORD,
        ARAMCO_EMAIL_SELECTOR,
        ARAMCO_PASSWORD_SELECTOR,
        ARAMCO_SUBMIT_SELECTOR,
        ARAMCO_AUTH_SUCCESS_TEXT,
    } = process.env;

    const required = {
        ARAMCO_LOGIN_URL,
        ARAMCO_EMAIL,
        ARAMCO_PASSWORD,
        ARAMCO_EMAIL_SELECTOR,
        ARAMCO_PASSWORD_SELECTOR,
        ARAMCO_SUBMIT_SELECTOR,
        ARAMCO_AUTH_SUCCESS_TEXT,
    };

    for (const [name, value] of Object.entries(required)) {
        if (!value?.trim()) {
            throw new Error(`Missing environment variable: ${name}`);
        }
    }

    // 1. Navigate to the login page.
    const navigation = await browser.callTool("browser_navigate", {
        url: ARAMCO_LOGIN_URL,
    });

    if (navigation.isError) {
        throw new Error(
            `Could not navigate to the login page: ${navigation.content?.map(item => item.text ?? "").join("\n")
            }`
        );
    }

    // 2. Inspect the login page.
    let snapshot = await browser.callTool("browser_snapshot", {});

    if (snapshot.isError) {
        throw new Error("Could not inspect the login page.");
    }

    let pageText = snapshot.content
        ?.map(item => item.text ?? "")
        .join("\n") ?? "";

    if (/This site can't be reached|chrome-error:\/\//i.test(pageText)) {
        throw new Error("The login page did not load correctly.");
    }

    if (!/Career Opportunities:\s*Sign In/i.test(pageText)) {
        throw new Error(
            "The expected sign-in page was not found. " +
            "Inspect the current page before attempting authentication."
        );
    }

    // 3. Fill the credentials.
    const fillResult = await browser.callTool("browser_fill_form", {
        fields: [
            {
                target: ARAMCO_EMAIL_SELECTOR,
                name: "Email",
                type: "textbox",
                value: ARAMCO_EMAIL,
            },
            {
                target: ARAMCO_PASSWORD_SELECTOR,
                name: "Password",
                type: "textbox",
                value: ARAMCO_PASSWORD,
            },
        ],
    });

    if (fillResult.isError) {
        throw new Error(
            `Could not fill the login form: ${fillResult.content?.map(item => item.text ?? "").join("\n")
            }`
        );
    }

    // 4. Submit the form.
    const clickResult = await browser.callTool("browser_click", {
        target: ARAMCO_SUBMIT_SELECTOR,
    });

    // A click can happen even when MCP reports a navigation timeout.
    // Inspect the resulting page before deciding what happened.
    snapshot = await browser.callTool("browser_snapshot", {});

    if (snapshot.isError) {
        throw new Error(
            "Could not inspect the page after submission. " +
            "Authentication status is unknown."
        );
    }

    pageText = snapshot.content
        ?.map(item => item.text ?? "")
        .join("\n") ?? "";

    console.log("Page after sign-in:\n", pageText);

    // 5. Verify an explicit success indicator.
    if (pageText.includes(ARAMCO_AUTH_SUCCESS_TEXT)) {
        console.log("Aramco authentication verified.");

        return {
            authenticated: true,
            status: "authenticated",
            pageText,
        };
    }

    // 6. Distinguish a failed login from an uncertain outcome.
    if (/Career Opportunities:\s*Sign In/i.test(pageText)) {
        throw new Error(
            "Authentication failed or was not completed. " +
            "The sign-in page is still displayed. " +
            "Check the credentials and any validation messages."
        );
    }

    if (/verification code|two-factor|multi-factor|captcha/i.test(pageText)) {
        return {
            authenticated: false,
            status: "additional_verification_required",
            pageText,
        };
    }

    if (clickResult.isError) {
        console.warn(
            "MCP reported an error during the click. " +
            "The resulting page does not establish authentication."
        );
    }

    return {
        authenticated: false,
        status: "unconfirmed",
        pageText,
    };
}
