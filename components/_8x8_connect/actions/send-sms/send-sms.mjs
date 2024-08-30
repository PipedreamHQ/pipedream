import app from "../../_8x8_connect.app.mjs";

export default {
  key: "_8x8_connect-send-sms",
  name: "Send SMS",
  description: "Send a SMS to the specified destination. [See the documentation](https://developer.8x8.com/connect/reference/send-sms-single)",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    destination: {
      propDefinition: [
        app,
        "destination",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },

  },
  async run({ $ }) {
    const response = await this.app.sendSms({
      $,
      data: {
        destination: this.destination,
        text: this.text,
      },
    });

    $.export("$summary", `Successfully queued SMS for processing. ID: '${response.umid}'`);

    return response;
  },
};
