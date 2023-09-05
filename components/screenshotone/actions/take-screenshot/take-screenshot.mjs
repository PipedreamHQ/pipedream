import app from "../../screenshotone.app.mjs";

export default {
  key: "screenshotone-take-screenshot",
  name: "Take Screenshot",
  description: "Takes and returns a screenshot of the given site with specified options. [See the documentation](https://screenshotone.com/docs/options)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    websiteUrl: {
      propDefinition: [
        app,
        "websiteUrl",
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
      options: [
        "png",
        "jpeg",
        "webp",
        "gif",
        "jp2",
        "tiff",
        "avif",
        "heif",
        "pdf",
        "html",
      ],
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
    blockChat: {
      propDefinition: [
        app,
        "blockChat",
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
      block_chat: this.blockChat,
      delay: this.delay,
    };

    const response = await this.app.takeScreenshot({
      $,
      params,
    });

    $.export("$summary", `Successfully took the screenshot from ${this.websiteUrl}`);
    return response;
  },
};
