import browserless from "../../browserless.app.mjs";
import fs from "fs";

export default {
  key: "browserless-take-screenshot",
  name: "Take a Screenshot",
  description: "Take a screenshot of a page. [See the documentation](https://www.browserless.io/docs/screenshot)",
  version: "0.5.2",
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
    }

    if (screenshot) {
      $.export("$summary", `Successfully created screenshot of URL ${this.url}.`);
    }

    return result;
  },
};
