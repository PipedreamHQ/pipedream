import screenshotbase from "../../screenshotbase.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "screenshotbase-take-screenshot",
  name: "Take a Screenshot",
  description: "Take a screenshot with ScreenshotBase. [See the documentation](https://screenshotbase.com/docs/take)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    screenshotbase,
    url: {
      propDefinition: [
        screenshotbase,
        "url",
      ],
    },
    format: {
      propDefinition: [
        screenshotbase,
        "format",
      ],
    },
    filename: {
      propDefinition: [
        screenshotbase,
        "filename",
      ],
    },
    quality: {
      propDefinition: [
        screenshotbase,
        "quality",
      ],
    },
    fullPage: {
      propDefinition: [
        screenshotbase,
        "fullPage",
      ],
    },
    viewportWidth: {
      propDefinition: [
        screenshotbase,
        "viewportWidth",
      ],
    },
    viewportHeight: {
      propDefinition: [
        screenshotbase,
        "viewportHeight",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    if (this.quality && this.format !== "jpg" && this.format !== "jpeg") {
      throw new ConfigurationError("**Quality** is only supported when the format is `jpg` or `jpeg`");
    }

    try {
      const response = await this.screenshotbase.takeScreenshot({
        $,
        params: {
          url: this.url,
          format: this.format,
          quality: this.quality,
          full_page: this.fullPage
            ? 1
            : undefined,
          viewport_width: this.viewportWidth,
          viewport_height: this.viewportHeight,
        },
      });

      const downloadedFilepath = `/tmp/${this.filename}`;
      fs.writeFileSync(downloadedFilepath, response);

      const filedata = [
        this.filename,
        downloadedFilepath,
      ];

      $.export("$summary", `Successfully took the screenshot from ${this.url}`);
      return filedata;
    } catch (error) {
      throw new Error(`Unable to take screenshot from ${this.url}: ${error.name}`);
    }
  },
};
