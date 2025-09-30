import screenshot_fyi from "../../screenshot_fyi.app.mjs";

export default {
  key: "screenshot_fyi-create-screenshot",
  name: "Create Screenshot",
  description: "Takes a screenshot of a webpage using Screenshot.fyi. [See the documentation](https://www.screenshot.fyi/api-docs)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    screenshot_fyi,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the webpage to capture",
    },
    width: {
      type: "integer",
      label: "Width",
      description: "Width of the viewport in pixels. Default: `1440`",
      optional: true,
    },
    height: {
      type: "integer",
      label: "Height",
      description: "Height of the viewport in pixels. Default: `900`",
      optional: true,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Capture the full scrollable page. Default: `false`",
      optional: true,
    },
    format: {
      type: "string",
      label: "Format",
      description: "The format of the screenshot. Default: `jpg`",
      options: [
        "png",
        "jpg",
        "jpeg",
      ],
      optional: true,
    },
    disableCookieBanners: {
      type: "boolean",
      label: "Disable Cookie Banners",
      description: "Attempt to remove cookie consent banners. Default: `true`",
      optional: true,
    },
    darkMode: {
      type: "boolean",
      label: "Dark Mode",
      description: "Enable dark mode when taking the screenshot. Default: `false`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.screenshot_fyi.takeScreenshot({
      $,
      params: {
        url: this.url,
        width: this.width,
        height: this.height,
        fullPage: this.fullPage,
        format: this.format,
        disableCookieBanners: this.disableCookieBanners,
        darkMode: this.darkMode,
      },
    });
    $.export("$summary", `Screenshot taken for ${this.url}`);
    return response;
  },
};
