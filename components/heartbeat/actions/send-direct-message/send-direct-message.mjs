import heartbeat from "../../heartbeat.app.mjs";

export default {
  key: "heartbeat-send-direct-message",
  name: "Send Direct Message",
  description: "Send a direct message in Heartbeat. [See the documentation](https://heartbeat.readme.io/reference/createdirectmessage)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    heartbeat,
    text: {
      type: "string",
      label: "Text",
      description: "See the [Rich Text page](https://heartbeat.readme.io/reference/rich-text) to learn more about formatting",
    },
    to: {
      propDefinition: [
        heartbeat,
        "userId",
      ],
      type: "string",
      label: "To",
      description: "The user ID of the receiver",
    },
    from: {
      propDefinition: [
        heartbeat,
        "userId",
        () => ({
          onlyAdmin: true,
        }),
      ],
      label: "From",
      description: "The user ID of the sender. Only an admin user can be chosen. If this field is not provided, the user that created the API key will be used",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.heartbeat.sendDirectMessage({
      $,
      data: {
        text: this.text,
        to: this.to,
        from: this.from,
      },
    });

    $.export("$summary", `Direct message successfully sent to ${this.to}.`);
    return response;
  },
};
