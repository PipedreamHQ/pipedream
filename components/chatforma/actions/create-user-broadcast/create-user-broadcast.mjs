import chatforma from "../../chatforma.app.mjs";

export default {
  key: "chatforma-create-user-broadcast",
  name: "Create User Broadcast",
  description: "Sends a broadcast message to a specific user. [See the documentation](https://docs.chatforma.com/#/developers/post_bots__botId__dispatch_user__botUserId_)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    chatforma,
    botId: {
      propDefinition: [
        chatforma,
        "botId",
      ],
    },
    botUserId: {
      propDefinition: [
        chatforma,
        "botUserId",
        ({ botId }) => ({
          botId,
        }),
      ],
    },
    content: {
      propDefinition: [
        chatforma,
        "content",
      ],
    },
    runAt: {
      type: "string",
      label: "Run At",
      description: "Date/Time to send message in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) timestamp format. Example: `2023-01-01T00:00:00.000Z`. Not providing a runAt will schedule the message for immediate delivery.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chatforma.dispatchUserBroadcast({
      $,
      botId: this.botId,
      botUserId: this.botUserId,
      data: {
        content: this.content,
        run_at: this.runAt,
      },
    });

    $.export("$summary", `Successfully sent broadcast to user ${this.botUserId}`);
    return response;
  },
};
