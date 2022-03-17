import line from "../../line.app.mjs";

export default {
  name: "Send a Push Message",
  description: "Sends a push message to a user, group, or room at any time.",
  key: "line-send-a-push-message",
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
  async run({ $ }) {
    const client = this.createLineClient(this.channelAccessToken);

    const response = client.pushMessage(this.to, {
      type: "text",
      text: this.message,
      notificationDisabled: this.notificationDisabled ?? false,
    });

    if (response["x-line-request-id"]) $.export("$summary", "Successfully sent push message");

    return response;
  },
};
