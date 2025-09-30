import puppeteer from "../../puppeteer.app.mjs";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "puppeteer-get-html",
  name: "Get HTML",
  description:
    "Get the HTML of a webpage using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.content) for details.",
  version: "1.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const html = await page.content();
    await browser.close();

    if (html) {
      $.export("$summary", `Successfully retrieved HTML from ${url}`);
    }

    return html;
  },
};
