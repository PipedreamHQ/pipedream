// legacy_hash_id: a_oViVKv
import puppeteer from "puppeteer-core";

export default {
  key: "browserless-take-screenshot",
  name: "Take a Screenshot",
  version: "0.5.3",
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
    screenshotOptions: {
      type: "object",
      label: "Screenshot Options",
      optional: true,
      description: "Pass options directly to the `Page.screenshot()` method. [Full list available here](https://puppeteer.github.io/puppeteer/docs/9.1.1/puppeteer.page.screenshot/)."
    },
    viewportOptions: {
      type: "object",
      label: "Viewport Options",
      optional: true,
      description: "Set the browsers viewport options. Passed to the `page.setViewport()` method."
    }
  },
  async run({ $ }) {
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${this.browserless.$auth.api_key}`,
    });
    const page = await browser.newPage();
    page.setViewport(this.viewportOptions)

    const { url } = this;
    await page.goto(url);
    const screenshot = await page.screenshot(this.screenshotOptions ?? {});

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
