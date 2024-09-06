import puppeteer from "../../puppeteer.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "puppeteer-get-html",
  name: "Get HTML",
  description:
    "Get the HTML of a webpage using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.content) for details.",
  version: "1.0.{{ts}}",
  type: "action",
  props: {
    puppeteer,
    ...common.props,
  },
  async run({ $ }) {
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(common.props.url);
    const html = await page.content();
    await browser.close();

    if (html) {
      $.export("$summary", "Successfully retrieved HTML from page.");
    }

    return html;
  },
};
