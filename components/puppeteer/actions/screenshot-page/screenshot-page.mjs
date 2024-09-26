import puppeteer from "../../puppeteer.app.mjs";
import constants from "../../common/constants.mjs";
import common from "../common/common.mjs";
import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "puppeteer-screenshot-page",
  name: "Screenshot a Page",
  description:
    "Captures a screenshot of a page using Puppeteer. [See the documentation](https://pptr.dev/api/puppeteer.page.screenshot)",
  version: "1.0.2",
  type: "action",
  props: {
    puppeteer,
    ...common.props,
    downloadPath: {
      type: "string",
      label: "Download Path",
      description:
        "Download the screenshot to the `/tmp` directory with the specified filename",
      optional: true,
    },
    captureBeyondViewport: {
      type: "boolean",
      label: "Capture Beyond Viewport",
      description: "Capture the screenshot beyond the viewport.",
      optional: true,
      default: true,
    },
    clipHeight: {
      type: "string",
      label: "Clip Height",
      description: "Specifies the height of the region of the page to clip.",
      optional: true,
    },
    clipScale: {
      type: "string",
      label: "Clip Scale",
      description: "Specifies the scale of the region of the page to clip.",
      default: "1",
      optional: true,
    },
    clipWidth: {
      type: "string",
      label: "Clip Width",
      description: "Specifies the width of the region of the page to clip.",
      optional: true,
    },
    clipX: {
      type: "string",
      label: "Clip X",
      description: "Specifies the X value of the region of the page to clip.",
      optional: true,
    },
    clipY: {
      type: "string",
      label: "Clip Y",
      description: "Specifies Y value of the region of the page to clip.",
      optional: true,
    },
    encoding: {
      type: "string",
      label: "Encoding",
      description: "Encoding of the image.",
      optional: true,
      default: "binary",
      options: constants.IMAGE_ENCODING,
    },
    fromSurface: {
      type: "boolean",
      label: "From Surface",
      description:
        "Capture the screenshot from the surface, rather than the view.",
      optional: true,
      default: false,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "When true, takes a screenshot of the full page.",
      optional: true,
      default: false,
    },
    omitBackground: {
      type: "boolean",
      label: "Omit Background",
      description:
        "Hides default white background and allows capturing screenshots with transparency.",
      optional: true,
      default: false,
    },
    optimizeForSpeed: {
      type: "boolean",
      label: "Optimize For Speed",
      description: "Optimize for speed.",
      optional: true,
      default: false,
    },
    quality: {
      type: "integer",
      label: "Quality",
      description:
        "Quality of the image, between 0-100. Not applicable to png images.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the screenshot image.",
      optional: true,
      default: "png",
      options: constants.SCREENSHOT_TYPE,
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
    if (
      (this.clipHeight || this.clipWidth || this.clipX || this.clipY) &&
      !(this.clipHeight && this.clipWidth && this.clipX && this.clipY)
    ) {
      throw new ConfigurationError(
        "Clip height, width, X, and Y must be specified to create clip.",
      );
    }

    const clip =
      this.clipHeight || this.clipWidth || this.clipX || this.clipY
        ? {
          height: parseFloat(this.clipHeight),
          scale: parseFloat(this.clipScale),
          width: parseFloat(this.clipWidth),
          x: parseFloat(this.clipX),
          y: parseFloat(this.clipY),
        }
        : undefined;

    const options = {
      captureBeyondViewport: this.captureBeyondViewport,
      clip,
      encoding: this.encoding,
      fromSurface: this.fromSurface,
      fullPage: this.fullPage,
      omitBackground: this.omitBackground,
      optimizeForSpeed: this.optimizeForSpeed,
      quality: this.quality,
      type: this.type,
    };

    const url = this.normalizeUrl();
    const browser = await this.puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot(options);
    await browser.close();

    const filePath =
      screenshot && this.downloadPath
        ? await this.downloadToTMP(screenshot)
        : undefined;

    if (screenshot) {
      $.export("$summary", `Successfully captured screenshot from ${url}`);
    }

    return filePath
      ? {
        screenshot: screenshot.toString("base64"),
        filePath,
      }
      : screenshot.toString("base64");
  },
};
