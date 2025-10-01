import line from "../../line_messaging_api.app.mjs";

export default {
  name: "Send Push Message",
  description: "Sends a push message to a user. [See the documentation](https://developers.line.biz/en/reference/messaging-api/#send-push-message)",
  key: "line_messaging_api-send-push-message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    line,
    to: {
      label: "To",
      type: "string",
      description: "The ID of user, group, or room the message will be sent to",
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
    const response = await this.line.sendPushMessage({
      $,
      data: {
        to: this.to,
        messages: [
          {
            type: "text",
            text: this.message,
          },
        ],
        notificationDisabled: this.notificationDisabled ?? false,
      },
    });
    $.export("$summary", `Successfully sent push message to: ${this.to}`);
    return response;
  },
};
