import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/base.mjs";
import utils from "../../common/utils.mjs";

export default {
  ...common,
  key: "cloudflare_browser_rendering-get-screenshot",
  name: "Get Screenshot",
  description: "Takes a screenshot of a webpage from provided URL or HTML. [See the documentation](https://developers.cloudflare.com/api/resources/browser_rendering/subresources/pdf/methods/create/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    screenshotOptionsCaptureBeyondViewport: {
      type: "boolean",
      label: "Screenshot Options - Capture Beyond Viewport",
      description: "Capture beyond the viewport",
      optional: true,
    },
    screenshotOptionsClip: {
      type: "object",
      label: "Screenshot Options - Clip",
      description: "Clip the screenshot. The clip object has the following properties: `height`, `width`, `x`, `y`, `scale` (Optional).",
      optional: true,
      default: {
        height: "800",
        width: "600",
        x: "0",
        y: "0",
        scale: "1",
      },
    },
    screenshotOptionsEncoding: {
      type: "string",
      label: "Screenshot Options - Encoding",
      description: "Encoding of the screenshot",
      optional: true,
      options: [
        "binary",
        "base64",
      ],
    },
    screenshotOptionsFromSurface: {
      type: "boolean",
      label: "Screenshot Options - From Surface",
      description: "Capture from the surface",
      optional: true,
    },
    screenshotOptionsFullPage: {
      type: "boolean",
      label: "Screenshot Options - Full Page",
      description: "Capture the full page",
      optional: true,
    },
    screenshotOptionsOmitBackground: {
      type: "boolean",
      label: "Screenshot Options - Omit Background",
      description: "Omit the background",
      optional: true,
    },
    screenshotOptionsOptimizeForSpeed: {
      type: "boolean",
      label: "Screenshot Options - Optimize For Speed",
      description: "Optimize for speed",
      optional: true,
    },
    screenshotOptionsQuality: {
      type: "integer",
      label: "Screenshot Options - Quality",
      description: "Quality of the screenshot",
      optional: true,
    },
    screenshotOptionsType: {
      type: "string",
      label: "Screenshot Options - Type",
      description: "Type of the screenshot",
      optional: true,
      options: [
        "png",
        "jpeg",
        "webp",
      ],
    },
    selector: {
      type: "string",
      label: "Selector",
      description: "Selector",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  methods: {
    async getScreenshot(args = {}) {
      try {
        return await this.app.post({
          path: "/screenshot",
          responseType: "arraybuffer",
          ...args,
        });
      } catch (error) {
        throw new Error(error.response.data.toString());
      }
    },
  },
  async run({ $ }) {
    const {
      getScreenshot,
      html,
      url,
      viewportHeight,
      viewportWidth,
      viewportDeviceScaleFactor,
      viewportHasTouch,
      viewportIsLandscape,
      viewportIsMobile,
      userAgent,
      screenshotOptionsCaptureBeyondViewport,
      screenshotOptionsClip,
      screenshotOptionsEncoding,
      screenshotOptionsFromSurface,
      screenshotOptionsFullPage,
      screenshotOptionsOmitBackground,
      screenshotOptionsOptimizeForSpeed,
      screenshotOptionsQuality,
      screenshotOptionsType,
      selector,
      additionalSettings,
    } = this;

    if (!html && !url) {
      throw new ConfigurationError("Either **HTML** or **URL** is required");
    }

    if ((viewportHeight && !viewportWidth) || (!viewportHeight && viewportWidth)) {
      throw new ConfigurationError("Both **Viewport - Height** and **Viewport - Width** are required when either is provided");
    }

    const response = await getScreenshot({
      $,
      data: {
        html,
        url,
        ...(screenshotOptionsCaptureBeyondViewport
          || screenshotOptionsClip
          || screenshotOptionsEncoding
          || screenshotOptionsFromSurface
          || screenshotOptionsFullPage
          || screenshotOptionsOmitBackground
          || screenshotOptionsOptimizeForSpeed
          || screenshotOptionsQuality
          || screenshotOptionsType
          ? {
            screenshotOptions: {
              captureBeyondViewport: screenshotOptionsCaptureBeyondViewport,
              clip: utils.parseJson(screenshotOptionsClip),
              encoding: screenshotOptionsEncoding,
              fromSurface: screenshotOptionsFromSurface,
              fullPage: screenshotOptionsFullPage,
              omitBackground: screenshotOptionsOmitBackground,
              optimizeForSpeed: screenshotOptionsOptimizeForSpeed,
              quality: screenshotOptionsQuality,
              type: screenshotOptionsType,
            },
          }
          : {}
        ),
        selector,
        ...(viewportHeight && {
          viewport: {
            height: viewportHeight,
            width: viewportWidth,
            deviceScaleFactor: viewportDeviceScaleFactor,
            hasTouch: viewportHasTouch,
            isLandscape: viewportIsLandscape,
            isMobile: viewportIsMobile,
          },
        }),
        userAgent,
        ...utils.parseJson(additionalSettings),
      },
    });

    const imagePath = path.join("/tmp", `screenshot.${screenshotOptionsType || "png"}`);
    fs.writeFileSync(imagePath, response);

    $.export("$summary", "Successfully fetched screenshot content");

    return imagePath;
  },
};
