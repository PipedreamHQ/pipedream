import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-create-chat-invite-link",
  name: "Create Chat Invite Link",
  description: "Create an additional invite link for a chat, [See the docs](https://core.telegram.org/bots/api#createchatinvitelink) for more information",
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
    name: {
      propDefinition: [
        telegramBotApi,
        "link_name",
      ],
    },
    expire_date: {
      propDefinition: [
        telegramBotApi,
        "expire_date",
      ],
    },
    member_limit: {
      propDefinition: [
        telegramBotApi,
        "member_limit",
      ],
    },
    creates_join_request: {
      propDefinition: [
        telegramBotApi,
        "creates_join_request",
      ],
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.createChatInviteLink(this.chatId, {
      name: this.name,
      expire_date: this.expire_date,
      member_limit: this.member_limit,
      creates_join_request: this.creates_join_request,
    });
    $.export("$summary", `Successfully created chat invite link, "${this.chatId}"`);
    return resp;
  },
};
