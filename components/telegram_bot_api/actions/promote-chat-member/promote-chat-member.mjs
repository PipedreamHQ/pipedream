import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-promote-chat-member",
  name: "Promote a Chat Member",
  description: "Use this method to promote or demote a user in a supergroup or a channel. [See the docs](https://core.telegram.org/bots/api#promotechatmember) for more information",
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
    userId: {
      propDefinition: [
        telegramBotApi,
        "userId",
      ],
    },
    can_change_info: {
      type: "boolean",
      label: "Set if the Administrator Can Change Info",
      description: "Pass True, if the administrator can change chat title, photo and other settings.",
      optional: true,
    },
    can_post_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Create Channel Posts",
      description: "Pass True, if the administrator can create channel posts [channels only].",
      optional: true,
    },
    can_edit_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Edit Messages",
      description: "Pass True, if the administrator can edit messages of other users and can pin messages [channels only].",
      optional: true,
    },
    can_delete_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Delete Messages",
      description: "Pass True, if the administrator can delete messages of other users [channels only].",
      optional: true,
    },
    can_invite_users: {
      type: "boolean",
      label: "Set if the Administrator Can Invite Users",
      description: "Pass True, if the administrator can invite new users to the chat.",
      optional: true,
    },
    can_restrict_members: {
      type: "boolean",
      label: "Set if the Administrator Can Restrict Members",
      description: "Pass True, if the administrator can restrict, ban or unban chat members.",
      optional: true,
    },
    can_pin_messages: {
      type: "boolean",
      label: "Set if the Administrator Can Pin Messages",
      description: "Pass True, if the administrator can pin messages [supergroups only].",
      optional: true,
    },
    can_promote_members: {
      type: "boolean",
      label: "Set if the Administrator Can Promote Members",
      description: "Pass True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that they have promoted, directly or indirectly (promoted by administrators that were appointed by them).",
      optional: true,
    },
  },
  async run({ $ }) {
    const resp = await this.telegramBotApi.promoteChatMember(this.chatId, this.userId, {
      can_change_info: this.can_change_info,
      can_post_messages: this.can_post_messages,
      can_edit_messages: this.can_edit_messages,
      can_delete_messages: this.can_delete_messages,
      can_invite_users: this.can_invite_users,
      can_restrict_members: this.can_restrict_members,
      can_pin_messages: this.can_pin_messages,
      can_promote_members: this.can_promote_members,
    });
    $.export("$summary", `Successfully promoted the user, "${this.userId}", in chat, "${this.chatId}"`);
    return resp;
  },
};
