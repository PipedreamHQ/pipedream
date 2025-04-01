import base from "../common/webhooks.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "telegram_bot_api-message-updates",
  name: "New Message Updates (Instant)",
  description: "Emit new event each time a Telegram message is created or updated.",
  version: "0.1.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...base.props,
    chatId: {
      propDefinition: [
        base.props.telegramBotApi,
        "chatId",
      ],
      optional: true,
    },
  },
  hooks: {
    ...base.hooks,
    async deploy() {
      if (this.chatId) {
        const { id } = await this.telegramBotApi.sdk().getChat(this.chatId);
        this._setChatId(id);
      }
      await base.hooks.deploy.call(this);
    },
  },
  methods: {
    ...base.methods,
    _getChatId() {
      return this.db.get("chatId");
    },
    _setChatId(chatId) {
      this.db.set("chatId", chatId);
    },
    getMeta(event, message) {
      return {
        id: event.update_id,
        summary: message.text,
        ts: new Date(message.edit_date ?? message.date),
      };
    },
    getEventTypes() {
      return [
        "message",
        "edited_message",
      ];
    },
    processEvent(event) {
      const message = event.edited_message ?? event.message;
      if (this.chatId) {
        const chatId = this._getChatId();
        if (chatId && chatId != message?.chat?.id) {
          return;
        }
      }
      this.$emit(event, this.getMeta(event, message));
    },
  },
  sampleEmit,
};
