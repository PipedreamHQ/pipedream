import telegramBotApi from "../../telegram_bot_api.app.mjs";

export default {
  key: "telegram_bot_api-set-chat-permissions",
  name: "Set Chat Permissions",
  description: "Set default chat permissions for all members. [See the docs](https://core.telegram.org/bots/api#setchatpermissions) for more information",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
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
    canSendMessages: {
      type: "boolean",
      label: "Send text messages",
      description: "If the user is allowed to send text messages, contacts, locations and venues",
      optional: true,
    },
    canSendMediaMessages: {
      type: "boolean",
      label: "Send media messages",
      description: "If the user is allowed to send audios, documents, photos, videos, video notes and voice notes",
      optional: true,
    },
    canSendPolls: {
      type: "boolean",
      label: "Send polls",
      description: "If the user is allowed to send polls",
      optional: true,
    },
    canSendOtherMessages: {
      type: "boolean",
      label: "Send other messages",
      description: "If the user is allowed to send animations, games, stickers and use inline bots",
      optional: true,
    },
    canAddWebPagePreviews: {
      type: "boolean",
      label: "Add web page previews",
      description: "If the user is allowed to add web page previews to their messages",
      optional: true,
    },
    canChangeInfo: {
      type: "boolean",
      label: "Change info",
      description: "If the user is allowed to change the chat title, photo and other settings. Ignored in public SuperGroups",
      optional: true,
    },
    canInviteUsers: {
      type: "boolean",
      label: "Send invite users",
      description: "If the user is allowed to invite new users to the chat",
      optional: true,
    },
    canPinMessages: {
      type: "boolean",
      label: "Pin messages",
      description: "If the user is allowed to pin messages. Ignored in public SuperGroups",
      optional: true,
    },
  },
  methods: {
    setPermission(chatPermissions, prop, value) {
      if (value !== null && value !== undefined) {
        chatPermissions[prop] = value;
      }
      return chatPermissions;
    },
  },
  async run({ $ }) {
    let chatPermissions = {};
    chatPermissions = this.setPermission(chatPermissions, "can_send_messages", this.canSendMessages);
    chatPermissions = this.setPermission(chatPermissions, "can_send_media_messages", this.canSendMediaMessages);
    chatPermissions = this.setPermission(chatPermissions, "can_send_polls", this.canSendPolls);
    chatPermissions = this.setPermission(chatPermissions, "can_send_other_messages", this.canSendOtherMessages);
    chatPermissions = this.setPermission(chatPermissions, "can_add_web_page_previews", this.canAddWebPagePreviews);
    chatPermissions = this.setPermission(chatPermissions, "can_change_info", this.canChangeInfo);
    chatPermissions = this.setPermission(chatPermissions, "can_invite_users", this.canInviteUsers);
    chatPermissions = this.setPermission(chatPermissions, "can_pin_messages", this.canPinMessages);
    const resp = await this.telegramBotApi.setChatPermissions(this.chatId, chatPermissions);
    $.export("$summary", `Successfully set chat permissions, "${this.chatId}"`);
    return resp;
  },
};
