import app from "../../screenshotone.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "screenshotone-take-screenshot",
  name: "Take Screenshot",
  description: "Takes and returns a screenshot of the given site with specified options. [See the documentation](https://screenshotone.com/docs/options)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    websiteUrl: {
      propDefinition: [
        app,
        "websiteUrl",
      ],
    },
    fileName: {
      propDefinition: [
        app,
        "fileName",
      ],
    },
    viewportWidth: {
      propDefinition: [
        app,
        "viewportWidth",
      ],
    },
    viewportHeight: {
      propDefinition: [
        app,
        "viewportHeight",
      ],
    },
    fullPage: {
      propDefinition: [
        app,
        "fullPage",
      ],
    },
    format: {
      propDefinition: [
        app,
        "format",
      ],
      options: constants.FORMAT_OPTIONS,
    },
    blockCookieBanners: {
      propDefinition: [
        app,
        "blockCookieBanners",
      ],
    },
    blockAds: {
      propDefinition: [
        app,
        "blockAds",
      ],
    },
    blockTrackers: {
      propDefinition: [
        app,
        "blockTrackers",
      ],
    },
    delay: {
      propDefinition: [
        app,
        "delay",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      url: this.websiteUrl,
      full_page: this.fullPage,
      format: this.format,
      viewport_width: this.viewportWidth,
      viewport_height: this.viewportHeight,
      block_cookie_banners: this.blockCookieBanners,
      block_ads: this.blockAds,
      block_trackers: this.blockTrackers,
      delay: this.delay,
    };

    const fileStream = await this.app.takeScreenshot({
      $,
      params,
    });

    const filePath = await this.app.writeStream({
      fileStream,
      fileName: `${this.fileName}.${this.format}`,
    });

    $.export("$summary", `Successfully took the screenshot from ${this.websiteUrl}`);
    return filePath;
  },
};
