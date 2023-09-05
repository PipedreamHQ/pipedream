import app from "../../screenshotone.app.mjs";

export default {
  key: "screenshotone-take-animated-screenshot",
  name: "Take Animated Screenshot",
  description: "Takes and returns an animated screenshot of the given site with specified options. [See the documentation](https://screenshotone.com/docs/animated-screenshots/)",
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
    fileName: {
      propDefinition: [
        app,
        "fileName",
      ],
    },
    scenario: {
      type: "string",
      label: "Scenario",
      description: "The default scenario is to record animation after loading the site without additional animations. [See the documentation](https://screenshotone.com/docs/animated-screenshots/#default-stand-still)",
      options: [
        "default",
        "scroll",
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
    format: {
      propDefinition: [
        app,
        "format",
      ],
      options: [
        "mp4",
        "mov",
        "avi",
        "webm",
        "gif",
      ],
    },
    scrollDelay: {
      type: "integer",
      label: "Scroll Delay",
      description: "Delay in milliseconds between scrolls. The default value is `500`",
      optional: true,
    },
    scrollDuration: {
      type: "integer",
      label: "Scroll Duration",
      description: "Duration in milliseconds of one scroll. The default value is `1500`",
      optional: true,
    },
    scrollBy: {
      type: "integer",
      label: "Scroll By",
      description: "By how many pixes scroll. The default value is `1000`",
      optional: true,
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
      scenario: this.scenario,
      format: this.format,
      width: this.viewportWidth,
      height: this.viewportHeight,
      block_cookie_banners: this.blockCookieBanners,
      block_ads: this.blockAds,
      block_trackers: this.blockTrackers,
      block_chat: this.blockChat,
      delay: this.delay,
      scroll_delay: this.scrollDelay,
      scroll_duration: this.scrollDuration,
      scroll_by: this.scrollBy,
    };

    const fileStream = await this.app.takeAnimatedScreenshot({
      $,
      params,
    });

    const filePath = await this.app.writeStream({
      fileStream,
      fileName: `${this.fileName}.${this.format}`,
    });

    $.export("$summary", `Successfully took the animated screenshot from ${this.websiteUrl}`);
    return filePath;
  },
};
