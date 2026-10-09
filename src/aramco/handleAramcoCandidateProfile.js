import { uploadFile } from "../stc/stcFileUploader.js";

import {
    ATTACHMENT_FIELDS,
    EDUCATION_FIELDS,
    EMPLOYMENT_FIELDS,
    PROFILE_FIELDS,
    LANGUAGE_FIELDS,
    JOB_SPECIFIC_FIELDS,
} from "./aramcoFields.js";

import {
    saveApplicationForm,
    expandAllSections,
} from "../stc/helper.js";

import { fillField } from "../stc/stcFieldHandlers.js";


export async function handleCandidateProfile(
    page,
    applicant
) {
    await expandAllSections(page);

    // -------------------------
    // Attachments
    // -------------------------

    for (const field of ATTACHMENT_FIELDS) {
        const filePath = applicant.files[field.key];

        if (!filePath) {
            console.log(
                `Skipping ${field.label}: no file provided.`
            );

            continue;
        }

        console.log("ATTACHMENT FIELD:", field);
        console.log("SELECTOR:", field.selector);
        console.log("FILE PATH:", applicant.files[field.key]);

        await uploadFile(
            page,
            field.selector,
            filePath,
            field.label
        );
    }

    // -------------------------
    // Profile Information
    // -------------------------

    for (const field of PROFILE_FIELDS) {
        await fillField(
            page,
            field,
            applicant.personal
        );
    }

    // -------------------------
    // Education
    // -------------------------

    const education =
        applicant.cv.education?.[0];

    if (education) {
        console.log(
            "Filling education section."
        );

        for (const field of EDUCATION_FIELDS) {
            await fillField(
                page,
                field,
                education
            );
        }

        console.log(
            "Education finished."
        );
    } else {
        console.log(
            "No education data found in parsed CV."
        );
    }

    // -------------------------
    // Employment History
    // -------------------------

    const employment =
        applicant.cv.employment?.[0];

    if (employment) {
        console.log(
            "Filling employment section."
        );

        for (const field of EMPLOYMENT_FIELDS) {
            await fillField(
                page,
                field,
                employment
            );
        }

        console.log(
            "Employment finished."
        );
    } else {
        console.log(
            "No employment data found in parsed CV."
        );
    }

    // -------------------------
    // Language Skills
    // -------------------------

    if (
        applicant.languages &&
        applicant.languages.length > 0
    ) {
        console.log(
            "Filling Language Skills..."
        );

        const rowInfo = page
            .locator('span[id$="_noItems"]')
            .filter({
                hasText: "Language Skills section",
            });

        const text =
            await rowInfo.textContent();

        const match =
            text?.match(/with (\d+) rows/);

        const existingRows = match
            ? Number(match[1])
            : 0;

        const requiredRows =
            applicant.languages.length;

        const rowsToAdd =
            requiredRows - existingRows;

        console.log({
            existingRows,
            requiredRows,
            rowsToAdd,
        });

        if (rowsToAdd > 0) {
            const addRowButton = page
                .locator(".addRowButton")
                .filter({
                    has: page.locator(
                        '[aria-label="Language Skills"]'
                    ),
                });

            for (
                let i = 0;
                i < rowsToAdd;
                i++
            ) {
                await addRowButton.click();
            }
        }

        for (
            let i = 0;
            i < applicant.languages.length;
            i++
        ) {
            const language =
                applicant.languages[i];

            for (const field of LANGUAGE_FIELDS) {
                await fillField(
                    page,
                    field,
                    language,
                    i
                );
            }
        }
    } else {
        console.log(
            "No language data found."
        );
    }

    await saveApplicationForm(page);
}


export async function handleApplicationForm(
    page,
    applicant,
    coverLetter
) {
    await expandAllSections(page);

    // -------------------------
    // Cover Letter
    // -------------------------

    const coverLetterField =
        ATTACHMENT_FIELDS.find(
            field =>
                field.key === "coverLetterPath"
        );

    if (
        coverLetterField &&
        coverLetter
    ) {
        const trashButton = page.locator(
            `${coverLetterField.selector} .removeAttachments`
        );

        if (await trashButton.count() > 0) {
            console.log(
                "Existing Cover Letter found. Removing it..."
            );

            await trashButton.click();

            const confirmButton = page.locator(
                'button[name="OK"]'
            );

            await confirmButton.waitFor({
                state: "visible",
                timeout: 10_000,
            });

            await confirmButton.click();

            console.log(
                "Existing Cover Letter removed."
            );
        }

        await uploadFile(
            page,
            coverLetterField.selector,
            coverLetter,
            coverLetterField.label
        );
    }

    // -------------------------
    // Job-Specific Information
    // -------------------------

    if (
        JOB_SPECIFIC_FIELDS.length > 0 &&
        applicant.aramcoSpecific
    ) {
        console.log(
            "ARAMCO SPECIFIC DATA:",
            applicant.aramcoSpecific
        );

        for (const field of JOB_SPECIFIC_FIELDS) {
            await fillField(
                page,
                field,
                applicant.aramcoSpecific
            );
        }
    } else {
        console.log(
            "No Aramco job-specific data found."
        );
    }

    await saveApplicationForm(page);
}