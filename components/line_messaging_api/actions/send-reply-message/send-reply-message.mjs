import line from "../../line_messaging_api.app.mjs";

export default {
  name: "Send Reply Message",
  description: "Sends a reply message to a user. [See the documentation](https://developers.line.biz/en/reference/messaging-api/#send-reply-message)",
  key: "line_messaging_api-send-reply-message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    line,
    replyToken: {
      label: "Message Reply Token",
      type: "string",
      description: "Reply token of the received message",
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
    const response = await this.line.sendReplyMessage({
      $,
      data: {
        replyToken: this.replyToken,
        messages: [
          {
            type: "text",
            text: this.message,
          },
        ],
        notificationDisabled: this.notificationDisabled ?? false,
      },
    });
    $.export("$summary", `Successfully sent reply message to: ${this.replyToken}`);
    return response;
  },
};
