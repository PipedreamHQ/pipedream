import app from "../../plivo.app.mjs";

export default {
  key: "plivo-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message to a phone number. [See the docs](https://www.plivo.com/docs/sms/api/message#send-a-message).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    src: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "Source",
      description: "The source number to send the SMS from. This number should be rented from Plivo.",
    },
    dst: {
      propDefinition: [
        app,
        "phoneNumber",
      ],
      label: "Destination",
      description: "The destination number to send the SMS to.",
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
  },
  async run({ $: step }) {
    const {
      src,
      dst,
      text,
    } = this;

    const response = await this.app.sendMessage([
      {
        src,
        dst,
        text,
      },
    ]);

    step.export("$summary", "Successfully queued SMS message");

    return response;
  },
};
