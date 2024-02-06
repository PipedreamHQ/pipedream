import puppeteer from "../../puppeteer.app.mjs";

export default {
  key: "puppeteer-get-html",
  name: "Get HTML",
  description: "Get the HTML of a webpage using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.content)",
  version: "1.0.1",
  type: "action",
  props: {
    puppeteer,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the page to scrape.",
    },
  },
  async run({ $ }) {
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url);
    const html = await page.content();
    await browser.close();

    if (html) {
      $.export("$summary", "Successfully retrieved HTML from page.");
    }

    return html;
  },
};
