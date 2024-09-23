import rasterwise from "../../rasterwise.app.mjs";

export default {
  key: "getscreenshot-capture-element-screenshot",
  name: "Capture Element Screenshot",
  description: "Captures a screenshot of a specific element on a website. [See the documentation](https://docs.rasterwise.com/docs/getscreenshot/api-reference-0/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rasterwise,
    websiteUrl: {
      propDefinition: [
        "rasterwise",
        "websiteUrl",
      ],
    },
    elementSelector: {
      propDefinition: [
        "rasterwise",
        "elementSelector",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rasterwise.getScreenshot();
    $.export(
      "$summary",
      `Successfully captured screenshot of element '${this.elementSelector}' from '${this.websiteUrl}'`,
    );
    return response;
  },
};
