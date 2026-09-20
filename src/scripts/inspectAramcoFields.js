import { chromium } from "playwright";

const URL = "https://career-sa20.hr.cloud.sap/portalcareer?company=saudiara05&rcm%5fsite%5flocale=en%5fUS&&navBarLevel=MY_PROFILE&_s.crb=QLB13YzMv7ExtnIFex0RjmnOlCOTw1ZY9qtuzupR5b8%253d";

const browser = await chromium.launch({
    headless: false,
});

const page = await browser.newPage();

await page.goto(URL, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
});

console.log(
    "\nNavigate to the Aramco form, expand the sections, then press Enter here..."
);

// Wait for you to manually navigate/login.
await new Promise(resolve => {
    process.stdin.once("data", resolve);
});

const fields = await page.locator(
    "input, select, textarea"
).evaluateAll(elements =>
    elements.map(element => ({
        tag: element.tagName,
        id: element.id,
        type: element.type,
        role: element.getAttribute("role"),
        ariaLabel: element.getAttribute("aria-label"),
        title: element.getAttribute("title"),
        placeholder: element.getAttribute("placeholder"),
        required: element.getAttribute("aria-required"),
        className: element.className,
    }))
);

const labels = await page.locator("label").evaluateAll(
    labels =>
        labels.map(label => ({
            text: label.innerText.trim(),
            id: label.id,
            for: label.getAttribute("for"),
        }))
);


console.table(fields);


console.table(labels);

await browser.close();