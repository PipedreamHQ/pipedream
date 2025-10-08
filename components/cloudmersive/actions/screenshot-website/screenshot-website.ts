import { defineAction } from "@pipedream/types";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";
import { ScreenshotWebsiteParams } from "../../common/types";

export default defineAction({
  name: "Screenshot Website",
  description: `Take a screenshot of a website [See docs here](${DOCS.screenshotWebsite})`,
  key: "cloudmersive-screenshot-website",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudmersive,
    url: {
      type: "string",
      label: "Website URL",
      description:
        "URL address of the website to screenshot. HTTP and HTTPS are both supported, as are custom ports.",
    },
    extraLoadingWait: {
      type: "integer",
      label: "Extra Loading Wait",
      description:
        "Additional number of milliseconds to wait once the web page has finished loading before taking the screenshot. Can be helpful for highly asynchronous websites. Provide a value of 0 for the default of 5000 milliseconds (5 seconds). Maximum is 20000 milliseconds (20 seconds).",
      optional: true,
      default: 0,
      min: 0,
      max: 20000,
    },
    screenshotWidth: {
      type: "integer",
      label: "Screenshot Width",
      description:
        "Width of the screenshot in pixels; supply 0 to default to 1280 x 1024.",
      optional: true,
      default: 0,
    },
    screenshotHeight: {
      type: "integer",
      label: "Screenshot Height",
      description:
        "Height of the screenshot in pixels; supply 0 to default to 1280 x 1024, supply -1 to measure the full screen height of the page and attempt to take a screen-height screenshot.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const { url } = this;
    const params: ScreenshotWebsiteParams = {
      $,
      data: {
        Url: url,
      },
    };

    const response = await this.cloudmersive.screenshotWebsite(params);

    $.export("$summary", `Captured website "${url}"`);

    return response;
  },
});
