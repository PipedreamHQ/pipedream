import rasterwise from "../../rasterwise.app.mjs";

export default {
  key: "getscreenshot-send-email-screenshot",
  name: "Send Screenshot via Email",
  description: "Capture a full screenshot from a live website and send it to a specified email address. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rasterwise,
    websiteUrl: {
      propDefinition: [
        rasterwise,
        "websiteUrl",
      ],
    },
    emailAddress: {
      propDefinition: [
        rasterwise,
        "emailAddress",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.rasterwise.getScreenshot();
    $.export("$summary", `Screenshot sent to ${this.emailAddress}`);
    return response;
  },
};
