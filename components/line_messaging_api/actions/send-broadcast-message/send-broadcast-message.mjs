import line from "../../line_messaging_api.app.mjs";

export default {
  name: "Send Broadcast Message",
  description: "Sends a broadcast message to all users. [See the documentation](https://developers.line.biz/en/reference/messaging-api/#send-broadcast-message)",
  key: "line_messaging_api-send-broadcast-message",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    line,
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
    const response = await this.line.sendBroadcastMessage({
      $,
      data: {
        messages: [
          {
            type: "text",
            text: this.message,
          },
        ],
        notificationDisabled: this.notificationDisabled ?? false,
      },
    });
    $.export("$summary", "Successfully sent broadcast message");
    return response;
  },
};
