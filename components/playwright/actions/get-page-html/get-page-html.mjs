import playwright from "../../playwright.app.mjs";

export default {
  key: "playwright-get-page-html",
  name: "Get Page HTML",
  description: "Returns the page's html. [See the documentation](https://playwright.dev/docs/api/class-page#page-content)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    playwright,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the page.",
    },
  },
  async run({ $ }) {
    const browser = await this.playwright.launch();
    const page = await browser.newPage();
    await page.goto(this.url);
    const html = await page.content();
    await browser.close();

    if (html) {
      $.export("$summary", "Successfully retrieved the HTML from page.");
    }

    return html;
  },
};
