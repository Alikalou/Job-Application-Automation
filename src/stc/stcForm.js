import { uploadFile } from "./stcFileUploader.js";
import { EDUCATION_FIELDS, PROFILE_FIELDS, JOB_SPECIFIC_FIELDS, LANGUAGE_FIELDS } from "./stcFields.js";
import { STC_SELECTORS } from "./stcSelectors.js";
import { ensureLanguageRows, saveApplicationForm } from "./helper.js";


async function expandAllSections(page) {
    const expandAllButton = page.locator(
        'a[id$="_expandAllSections"]'
    );

    await expandAllButton.waitFor({
        state: "visible",
        timeout: 15_000,
    });

    console.log("Expanding all sections...");

    await expandAllButton.click();

    console.log("All sections expanded.");
}

async function fillField(
    page,
    field,
    applicant,

) {
    let value = applicant[field.key];

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        console.log(
            `Skipping ${field.key}: no value`
        );
        return;
    }

    if (field.transform) {
        value = field.transform(value);
    }


    switch (field.type) {
        case "input":
            await fillInput(
                page,
                field.selector,
                value
            );
            break;

        case "combobox":
            await fillCombobox(
                page,
                field.selector,
                value
            );

            const languageInput = page.locator(
                'input[aria-label="Language"]'
            ).first();

            console.log(
                "LANGUAGE BEFORE PROFICIENCY:",
                await languageInput.inputValue(),
                await languageInput.getAttribute(
                    "aria-expanded"
                )
            );

            const proficiencyInput = page.locator(
                'input[aria-label="Language Proficiency"]'
            ).first();

            await proficiencyInput.click();

            console.log(
                "LANGUAGE AFTER PROFICIENCY CLICK:",
                await languageInput.inputValue(),
                await languageInput.getAttribute(
                    "aria-expanded"
                )
            );
            break;

        case "select":
            await fillSelect(page, field.selector, value);
            break;

        case "checkbox":
            await fillCheckbox(page, field.selector, value);
            break;

        default:
            throw new Error(
                `Unknown field type: ${field.type}`
            );
    }
}

async function fillInput(
    page,
    selector,
    value
) {
    console.log(
        `Looking for ${selector}...`
    );

    const input = page
        .locator(selector)
        .first();

    await input.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    console.log(
        `Found ${selector}`
    );

    await input.fill(
        String(value)
    );

    // Commit the value by moving focus away
    await input.press("Tab");

    console.log(
        `Filled ${selector} with "${value}"`
    );

    console.log(
        `Current value: "${await input.inputValue()}"`
    );
}


async function fillCombobox(
    page,
    selector,
    value
) {

    const input = page
        .locator(selector)
        .first();

    await input.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await input.click();
    await input.fill(value);

    const option = page
        .locator('[role="option"]:visible')
        .filter({
            hasText: value,
        })
        .first();

    await option.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await option.click();
}

async function fillCheckbox(
    page,
    selector,
    value
) {
    if (typeof value !== "boolean") {
        throw new Error(
            `Checkbox value must be boolean: ${selector}`
        );
    }

    const checkbox = page
        .locator(selector)
        .first();

    await checkbox.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await checkbox.setChecked(value);

    console.log(
        `${selector} checked: ${await checkbox.isChecked()}`
    );
}

async function fillSelect(
    page,
    selector,
    value
) {
    const select = page.locator(selector);

    await select.selectOption(value);

    console.log(
        `Selected option for ${selector}`
    );
}

export async function handleApplicationForm(
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

    await uploadFile(
        page,
        STC_SELECTORS.coverLetterField,
        applicant.coverLetterPath,
        "Cover Letter"
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

    console.log("Filling education section.");

    const education = applicant.cv.education?.[0];

    if (education) {
        for (const field of EDUCATION_FIELDS) {
            await fillField(
                page,
                field,
                education
            );
        }
    } //Maybe I should do this check early on? 
    else {
        console.log(
            "No education data found in parsed CV."
        );
    }

    console.log("Education finished.");

    console.log("Filling Language Skills...");

    // -------------------------
    // Language Skills
    // -------------------------
    const language =
        applicant.languages?.[0];

    if (language) {
        for (const field of LANGUAGE_FIELDS) {
            await fillField(
                page,
                field,
                language
            );
        }
    } else {
        console.log(
            "No language data found in parsed CV."
        );
    }
    // -------------------------
    // Job-Specific Information
    // -------------------------

    if (applicant.stcSpecific) {
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