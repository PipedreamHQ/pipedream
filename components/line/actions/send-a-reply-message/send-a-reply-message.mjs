import line from "../../line.app.mjs";

export default {
  name: "Send a Reply Message",
  description: "Sends a reply message in response to an event from a user, group, or room.",
  key: "line-send-a-reply-message",
  version: "0.0.1",
  type: "action",
  props: {
    line,
    channelAccessToken: {
      propDefinition: [
        line,
        "channelAccessToken",
      ],
    },
    replyToken: {
      label: "Message Reply Token",
      type: "string",
      description: "Reply token of received message.",
    },
    message: {
      propDefinition: [
        line,
        "message",
      ],
    },
    notificationDisabled: {
      propDefinition: [
        line,
        "notificationDisabled",
      ],
    },
  },
  async run({ $ }) {
    const client = this.createLineClient(this.channelAccessToken);

    const response = client.replyMessage(this.replyToken, {
      type: "text",
      text: this.message,
      notificationDisabled: this.notificationDisabled || false,
    });

    if (response["x-line-request-id"]) $.export("$summary", "Successfully sent reply message");

    return response;
  },
};
