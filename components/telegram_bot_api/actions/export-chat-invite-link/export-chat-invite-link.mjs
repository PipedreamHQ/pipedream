import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-export-chat-invite-link",
  name: "Export Chat Invite Link",
  description: "Generate a new primary invite link for a chat, [See the docs](https://core.telegram.org/bots/api#createchatinvitelink) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    telegramBotApi,
    chatId: {
      propDefinition: [
        telegramBotApi,
        "chatId",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.exportChatInviteLink(this.chatId);
    $.export("$summary", `Successfully exported chat invite link, "${this.chatId}"`);
    return resp;
  },
};
