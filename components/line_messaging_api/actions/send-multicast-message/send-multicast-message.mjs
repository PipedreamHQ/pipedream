import line from "../../line_messaging_api.app.mjs";

export default {
  name: "Send Multicast Message",
  description: "Sends a multicast message to a list of users. [See the documentation](https://developers.line.biz/en/reference/messaging-api/#send-multicast-message)",
  key: "line_messaging_api-send-multicast-message",
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
      type: "string[]",
      description: "An array of user IDs to send the message to",
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
    const response = await this.line.sendMulticastMessage({
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
    $.export("$summary", `Successfully sent multicast message to: ${this.to}`);
    return response;
  },
};
