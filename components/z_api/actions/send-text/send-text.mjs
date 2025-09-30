import app from "../../z_api.app.mjs";

export default {
  key: "z_api-send-text",
  name: "Send Text",
  description: "Send a text to the specified phone. [See the documentation](https://developer.z-api.io/en/message/send-message-text)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendText({
      $,
      data: {
        phone: this.phone,
        message: this.message,
      },
    });
    $.export("$summary", "Successfully sent text to" + this.phone);
    return response;
  },
};
