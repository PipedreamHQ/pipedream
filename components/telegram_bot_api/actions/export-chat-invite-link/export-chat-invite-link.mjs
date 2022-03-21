import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-export-chat-invite-link",
  name: "Export Chat Invite Link",
  description: "Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success.",
  version: "0.0.1",
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
