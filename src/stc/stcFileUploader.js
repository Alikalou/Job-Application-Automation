import { STC_SELECTORS } from "./stcSelectors.js";

export async function uploadFile(
    page,
    fieldSelector,
    filePath,
    label
) {
    const field = page
        .locator(fieldSelector)
        .first();

    await field.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    console.log(`Found ${label} field.`);

    const existingUpload = field.locator(
        STC_SELECTORS.removeAttachmentButton
    );

    if (await existingUpload.count() > 0) {
        await removeExistingFile(
            page,
            fieldSelector,
            label
        );
    }

    // Re-resolve after possible removal/rerender
    const currentField = page
        .locator(fieldSelector)
        .first();

    const addButton = currentField.locator(
        STC_SELECTORS.addAttachmentButton
    );

    await addButton.click();

    const fileInput = page.locator(
        STC_SELECTORS.fileInput
    );

    await fileInput.waitFor({
        state: "attached",
        timeout: 10_000,
    });

    await fileInput.setInputFiles(filePath);

    // SuccessFactors may rebuild the attachment component,
    // so resolve it again after uploading.
    const uploadedField = page
        .locator(fieldSelector)
        .first();

    const removeButton = uploadedField.locator(
        STC_SELECTORS.removeAttachmentButton
    );

    await removeButton.waitFor({
        state: "visible",
        timeout: 15_000,
    });

    console.log(
        `${label} uploaded successfully.`
    );
}
async function removeExistingFile(
    page,
    fieldSelector,
    label
) {
    const field = page
        .locator(fieldSelector)
        .first();

    const removeButton = field.locator(
        STC_SELECTORS.removeAttachmentButton
    );

    if (await removeButton.count() === 0) {
        return;
    }

    console.log(
        `Existing ${label} found. Removing it...`
    );

    await removeButton.click();

    const confirmButton = page.locator(
        STC_SELECTORS.confirmDeleteButton
    );

    await confirmButton.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await confirmButton.click();

    console.log(
        `Existing ${label} removed.`
    );
}
