// legacy_hash_id: a_oViVKv
import puppeteer from "puppeteer-core";

export default {
  key: "browserless-take-screenshot",
  name: "Take a Screenshot",
  version: "0.5.1",
  type: "action",
  props: {
    browserless: {
      type: "app",
      app: "browserless",
    },
    url: {
      type: "string",
      label: "URL",
      description: "Enter the URL you'd like to take a screenshot of here",
    },
  },
  async run({ $ }) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${this.browserless.$auth.api_key}`,
    });
    const page = await browser.newPage();

    const { url } = this;
    await page.goto(url);
    const screenshot = await page.screenshot();

    // export the base64-encoded screenshot for use in future steps,
    // along with the image type and filename
    $.export("screenshot", Buffer.from(screenshot, "binary").toString("base64"));
    $.export("type", "png");
    $.export(
      "filename",
      `${url.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_")}-${+new Date()}.${this.type}`,
    );

    await browser.close();
  },
};
