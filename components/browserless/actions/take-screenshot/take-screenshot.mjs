import browserless from "../../browserless.app.mjs";
import fs from "fs";

export default {
  key: "browserless-take-screenshot",
  name: "Take a Screenshot",
  description: "Take a screenshot of a page. [See the documentation](https://www.browserless.io/docs/screenshot)",
  version: "0.5.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserless,
    url: {
      type: "string",
      label: "URL",
      description: "Enter the URL you'd like to take a screenshot of here",
    },
    downloadPath: {
      type: "string",
      label: "Download Path",
      description: "Download the screenshot to the `/tmp` directory with the specified filename",
      optional: true,
    },
    waitForSelector: {
      type: "string",
      label: "Selector",
      description: "Allows you to wait for a selector to appear in the DOM. See [more details in the API Doc](https://www.browserless.io/docs/screenshot#custom-behavior-with-waitfor)",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async downloadToTMP(screenshot) {
      const path = this.downloadPath.includes("/tmp")
        ? this.downloadPath
        : `/tmp/${this.downloadPath}`;
      fs.writeFileSync(path, screenshot);
      return path;
    },
  },
  async run({ $ }) {
    const screenshot = await this.browserless.takeScreenshot({
      data: {
        url: this.url,
        bestAttempt: true,
        waitForSelector: this.waitForSelector
          ? `{ "selector": "${this.waitForSelector}" }`
          : undefined,
      },
      $,
    });

    const result = {
      screenshot: screenshot.toString("base64"),
      type: "png",
    };

    if (screenshot && this.downloadPath) {
      const filePath = await this.downloadToTMP(screenshot);
      result.filename = filePath;
      result.filePath = filePath;
    }

    if (screenshot) {
      $.export("$summary", `Successfully created screenshot of URL ${this.url}.`);
    }

    return result;
  },
};
