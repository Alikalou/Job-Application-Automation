import { uploadFile } from "./stcFileUploader.js";
import { EDUCATION_FIELDS, PROFILE_FIELDS, JOB_SPECIFIC_FIELDS, LANGUAGE_FIELDS } from "./stcFields.js";
import { STC_SELECTORS } from "./stcSelectors.js";
import { saveApplicationForm, expandAllSections } from "./helper.js";
import { fillField } from "./stcFieldHandlers.js";

export async function handleCandidateProfile(
    page,
    applicant
) {
    await expandAllSections(page);

    await uploadFile(
        page,
        STC_SELECTORS.resumeField,
        applicant.cvPdfPath,
        "Resume"
    );

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
    // Language Skills
    // -------------------------

    if (
        applicant.languages &&
        applicant.languages.length > 0
    ) {
        console.log("Filling Language Skills...");

        const rowInfo = page
            .locator('span[id$="_noItems"]')
            .filter({
                hasText: "Language Skills section",
            });

        const text = await rowInfo.textContent();
        const match = text.match(/with (\d+) rows/);

        const existingRows = match
            ? Number(match[1])
            : 0;

        const requiredRows =
            applicant.languages.length;

        const rowsToAdd = requiredRows - existingRows;

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

            for (let i = 0; i < rowsToAdd; i++) {
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

    const trashButton = page.locator(
        `${STC_SELECTORS.coverLetterField} .removeAttachments`
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
        STC_SELECTORS.coverLetterField,
        coverLetter,
        "Cover Letter"
    );
    // -------------------------
    // Job-Specific Information
    // -------------------------

    /*   await fillField(
                    page,
                    field,
                    language,
                    i
                );*/

    if (applicant.stcSpecific) {
        console.log(
            "STC SPECIFIC DATA:",
            applicant.stcSpecific
        );
        for (const field of JOB_SPECIFIC_FIELDS) {
            await fillField(
                page,
                field,
                applicant.stcSpecific
            );
        }
    } else {
        console.log(
            "No job-specific data found."
        );
    }

    await saveApplicationForm(page);
}