import app from "../../tinko.app.mjs";

export default {
  key: "tinko-transfer-chat",
  name: "Transfer Chat",
  description: "Move a chat to another channel and, optionally, to a specific attendant."
    + " Use **List Chats** to find the chat ID, **List Channels** to find the channel"
    + " and **List Users** to find the attendant."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/chats/#transferir-chat)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    chatId: {
      propDefinition: [
        app,
        "chatId",
      ],
    },
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
      description: "The channel that receives the chat, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Channels** to find channel IDs (the `id` field).",
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The Tinko user that receives the chat, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Users** to find user IDs (the `id` field).",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Internal message recorded with the transfer, up to 1000 characters, e.g. `Customer asked about a refund`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.transferChat({
      $,
      chatId: this.chatId,
      data: {
        channel: this.channelId,
        attendant: this.userId,
        message: this.message,
      },
    });

    $.export("$summary", `Successfully transferred chat ${this.chatId}`);
    return response.data;
  },
};
