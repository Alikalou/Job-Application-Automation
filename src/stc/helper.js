import { STC_SELECTORS } from "./stcSelectors.js";

export async function ensureLanguageRows(
    page,
    languageCount
) {
    const section = page
        .locator(STC_SELECTORS.languageSection)
        .first();

    const rows = section.locator(
        STC_SELECTORS.languageRows
    );

    const existingCount =
        await rows.count();

    const rowsToAdd =
        languageCount - existingCount;

    console.log(
        `Language rows: ${existingCount}, needed: ${languageCount}`
    );

    if (rowsToAdd <= 0) {
        return;
    }

    const addButton = section.locator(
        STC_SELECTORS.addLanguageRowButton
    );

    await addButton.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    for (let i = 0; i < rowsToAdd; i++) {
        await addButton.click();

        console.log(
            `Added language row ${existingCount + i + 1}`
        );
    }
}

export async function saveApplicationForm(page) {
    const saveButton = page.locator(
        '.rcmAppBtnWrapper [id$="_saveBtn"]'
    );

    await saveButton.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    console.log("Clicking Save...");

    await saveButton.click();

    await page.waitForTimeout(3000);

    console.log("Save clicked.");

    const errors = page.locator(
        '.fieldError, .errorMessage, [role="alert"]'
    );

    const count = await errors.count();

    console.log(`Possible validation messages: ${count}`);

    for (let i = 0; i < count; i++) {
        const text = await errors
            .nth(i)
            .innerText()
            .catch(() => "");

        if (text.trim()) {
            console.log("Validation:", text.trim());
        }
    }
}