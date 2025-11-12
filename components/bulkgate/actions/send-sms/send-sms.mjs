import app from "../../bulkgate.app.mjs";

export default {
  key: "bulkgate-send-sms",
  name: "Send SMS",
  description: "Sends an SMS message to a phone number. [See the docs](https://help.bulkgate.com/docs/en/http-simple-transactional-post-json.html).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    unicode: {
      propDefinition: [
        app,
        "unicode",
      ],
    },
    senderId: {
      propDefinition: [
        app,
        "senderId",
      ],
    },
    senderIdValue: {
      propDefinition: [
        app,
        "senderIdValue",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    appId: {
      propDefinition: [
        app,
        "appId",
      ],
    },
    appToken: {
      propDefinition: [
        app,
        "appToken",
      ],
    },
  },
  methods: {
    sendSMS(args = {}) {
      return this.app.create({
        path: "/simple/transactional",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      number,
      text,
      unicode,
      senderId,
      senderIdValue,
      country,
      appId,
      appToken,
    } = this;

    const response = await this.sendSMS({
      step,
      data: {
        number,
        text,
        unicode,
        sender_id: senderId,
        sender_id_value: senderIdValue,
        country,
        appId,
        appToken,
      },
    });

    step.export("$summary", `Successfully sent SMS with ID ${response.data.sms_id}`);

    return response;
  },
};
