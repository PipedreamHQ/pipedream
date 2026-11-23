import app from "../../tinko.app.mjs";

export default {
  key: "tinko-close-chat",
  name: "Close Chat",
  description: "Finish an open chat, optionally asking Tinko to generate an AI summary of the conversation."
    + " Fails if the chat is already finished."
    + " Use **List Chats** to find open chats and **List Users** to find the attendant."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/chats/)",
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
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The Tinko user registered as the one who closed the chat, e.g. `01JABCDEFGHJKMNPQRSTVWXYZ0`. Use **List Users** to find user IDs (the `id` field).",
      optional: true,
    },
    generateSummary: {
      type: "boolean",
      label: "Generate Summary",
      description: "Whether to ask Tinko to generate an AI summary of the chat after closing it, e.g. `true`. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.closeChat({
      $,
      chatId: this.chatId,
      data: {
        attendant: this.userId,
        generate_summary: this.generateSummary,
      },
    });

    $.export("$summary", `Successfully closed chat ${this.chatId}`);
    return response.data;
  },
};
