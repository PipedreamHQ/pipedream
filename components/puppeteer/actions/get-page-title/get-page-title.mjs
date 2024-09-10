import puppeteer from "../../puppeteer.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "puppeteer-get-page-title",
  name: "Get Page Title",
  description:
    "Get the title of a webpage using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.title)",
  version: "1.0.2",
  type: "action",
  props: {
    puppeteer,
    ...common.props,
  },
  async run({ $ }) {
    const url = this.normalizeUrl();
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const title = await page.title();
    await browser.close();

    if (title) {
      $.export("$summary", `Successfully retrieved the title from ${url}.`);
    }

    return title;
  },
};
