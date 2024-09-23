import getscreenshot from "../../getscreenshot.app.mjs";

export default {
  key: "getscreenshot-take-screenshot",
  name: "Take Screenshot",
  description: "Capture a full screenshot from a live website. [See the documentation](https://docs.rasterwise.com/docs/getscreenshot/api-reference-0/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    getscreenshot: {
      type: "app",
      app: "rasterwise",
    },
    websiteUrl: {
      propDefinition: [
        getscreenshot,
        "websiteUrl",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.getscreenshot.getScreenshot();
    $.export("$summary", `Successfully captured screenshot of ${this.websiteUrl}`);
    return response;
  },
};
