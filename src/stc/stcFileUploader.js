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

    /*
     * Check whether this field already
     * contains an uploaded file.
     */
    const existingUpload = field.locator(
        STC_SELECTORS.uploadSuccess
    );

    if (await existingUpload.isVisible()) {
        console.log(
            `${label} already uploaded. Skipping.`
        );

        return;
    }

    /*
     * No existing file, so upload it.
     */
    const addButton = field.locator(
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

    await fileInput.setInputFiles(
        filePath
    );

    /*
     * Verify successful upload.
     */
    const success = field.locator(
        STC_SELECTORS.uploadSuccess
    );

    await success.waitFor({
        state: "visible",
        timeout: 15_000,
    });

    console.log(
        `${label} uploaded successfully.`
    );
}