import puppeteer from "../../puppeteer.app.mjs";

export default {
  key: "puppeteer-get-page-title",
  name: "Get Page Title",
  description: "Get the title of a webpage using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.title)",
  version: "1.0.0",
  type: "action",
  props: {
    puppeteer,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage to get the title from.",
    },
  },
  async run({ $ }) {
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url);
    const title = await page.title();
    await browser.close();

    if (title) {
      $.export("$summary", `Successfully retrieved title ${title}.`);
    }

    return title;
  },
};
