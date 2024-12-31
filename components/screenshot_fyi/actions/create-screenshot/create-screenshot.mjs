import screenshot_fyi from "../../screenshot_fyi.app.mjs";

export default {
  key: "screenshot_fyi-create-screenshot",
  name: "Create Screenshot",
  description: "Takes a screenshot of a webpage using Screenshot.fyi. [See the documentation](https://www.screenshot.fyi/api-docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    screenshot_fyi: {
      type: "app",
      app: "screenshot_fyi",
    },
    url: {
      propDefinition: [
        screenshot_fyi,
        "url",
      ],
    },
    width: {
      propDefinition: [
        screenshot_fyi,
        "width",
      ],
    },
    height: {
      propDefinition: [
        screenshot_fyi,
        "height",
      ],
    },
    fullpage: {
      propDefinition: [
        screenshot_fyi,
        "fullpage",
      ],
    },
    format: {
      propDefinition: [
        screenshot_fyi,
        "format",
      ],
    },
    disableCookieBanners: {
      propDefinition: [
        screenshot_fyi,
        "disableCookieBanners",
      ],
      optional: true,
    },
    darkMode: {
      propDefinition: [
        screenshot_fyi,
        "darkMode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.screenshot_fyi.takeScreenshot();
    $.export("$summary", `Screenshot taken for ${this.url}`);
    return response;
  },
};
