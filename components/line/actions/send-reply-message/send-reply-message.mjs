import line from "../../line.app.mjs";

export default {
  name: "Send Reply Message",
  description: "Sends a reply message in response to an event from a user, group, or room. [See docs](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)",
  key: "line-send-reply-message",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "Reply token of the received message.",
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
  async run() {
    return this.line.sendReplyMessage(this.channelAccessToken, this.replyToken, {
      type: "text",
      text: this.message,
      notificationDisabled: this.notificationDisabled ?? false,
    });
  },
};
