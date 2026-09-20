export async function fillField(
    page,
    field,
    applicant,
    index = 0
) {
    let value = applicant[field.key];

    if (value === undefined || value === null || value === "") {
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
                value,
                index
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
    value,
    index = 0
) {

    const input = page
        .locator(selector)
        .nth(index);

    await input.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await input.click();
    await input.fill(value);

    const option = page
        .locator('[role="option"]:visible')
        .filter({
            hasText: new RegExp(
                `^${value}$`,
                "i"
            ),
        });

    await option.waitFor({
        state: "visible",
        timeout: 10_000,
    });

    await option.click();

    console.log(
        "AFTER OPTION CLICK:",
        {
            requestedValue: value,
            inputValue: await input.inputValue(),
            title: await input.getAttribute("title"),
            invalid: await input.getAttribute(
                "aria-invalid"
            ),
            expanded: await input.getAttribute(
                "aria-expanded"
            ),
        }
    );

}

async function fillCheckbox(page, selector, value) {
    const checkbox = page
        .locator(selector)
        .first();

    const isChecked =
        await checkbox.isChecked();

    if (isChecked !== value) {
        await checkbox.click();
    }
    console.log(
        "Checkbox after click:",
        await checkbox.isChecked()
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
