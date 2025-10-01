import line from "../../line.app.mjs";

export default {
  name: "Send Broadcast Message",
  description: "Sends a broadcast message to multiple users at any time. [See docs](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message)",
  key: "line-send-broadcast-message",
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
    return this.line.sendBroadcastMessage(this.channelAccessToken, {
      type: "text",
      text: this.message,
      notificationDisabled: this.notificationDisabled ?? false,
    });
  },
};
