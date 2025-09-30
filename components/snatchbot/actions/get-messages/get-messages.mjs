import snatchbot from "../../snatchbot.app.mjs";

export default {
  key: "snatchbot-get-messages",
  name: "Get Messages",
  description: "Retrieve a message or a list of messages. [See the documentation](https://support.snatchbot.me/reference/get-message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    snatchbot,
    userId: {
      propDefinition: [
        snatchbot,
        "userId",
      ],
    },
    messageId: {
      propDefinition: [
        snatchbot,
        "messageId",
        (c) => ({
          userId: c.userId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.snatchbot.listMessages({
      params: {
        user_id: this.userId,
        message_id: this.messageId,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully retrieved ${response.messages.length} message${response.messages.length === 1
        ? ""
        : "s"}.`);
    }

    return response;
  },
};
