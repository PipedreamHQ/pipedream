import playwright from "../../playwright.app.mjs";

export default {
  key: "playwright-get-page-title",
  name: "Get Page Title",
  description: "Returns the page's title. [See the documentation](https://playwright.dev/docs/api/class-page#page-title)",
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
    const title = await page.title();
    await browser.close();

    if (title) {
      $.export("$summary", "Successfully retrieved title from page.");
    }

    return title;
  },
};
