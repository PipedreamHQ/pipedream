import app from "../../sendblue.app.mjs";

export default {
  key: "sendblue-send-message",
  name: "Send Message",
  description: "Send an iMessage or SMS to a specific phone number. [See the documentation](https://docs.sendblue.com/api/resources/messages/methods/send)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fromNumber: {
      propDefinition: [
        app,
        "fromNumber",
      ],
    },
    toNumber: {
      propDefinition: [
        app,
        "toNumber",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    mediaUrl: {
      propDefinition: [
        app,
        "mediaUrl",
      ],
    },
    sendStyle: {
      propDefinition: [
        app,
        "sendStyle",
      ],
    },
    statusCallback: {
      propDefinition: [
        app,
        "statusCallback",
      ],
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      fromNumber,
      toNumber,
      content,
      mediaUrl,
      sendStyle,
      statusCallback,
    } = this;

    const response = await app.sendMessage({
      $,
      data: {
        from_number: fromNumber,
        number: toNumber,
        content,
        media_url: mediaUrl,
        send_style: sendStyle,
        status_callback: statusCallback,
      },
    });

    $.export("$summary", "Successfully sent message");
    return response;
  },
};
