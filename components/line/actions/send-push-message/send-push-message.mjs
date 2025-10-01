import line from "../../line.app.mjs";

export default {
  name: "Send Push Message",
  description: "Sends a push message to a user, group, or room at any time. [See docs](https://developers.line.biz/en/reference/messaging-api/#send-push-message)",
  key: "line-send-push-message",
  version: "0.0.3",
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
    to: {
      label: "To",
      type: "string",
      description: "The id of user, group, or room the message will be sent to.",
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
    return this.line.sendPushMessage(this.channelAccessToken, this.to, {
      type: "text",
      text: this.message,
      notificationDisabled: this.notificationDisabled ?? false,
    });
  },
};
