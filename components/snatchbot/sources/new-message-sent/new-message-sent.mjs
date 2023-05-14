import snatchbot from "../../snatchbot.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "snatchbot-new-message-sent",
  name: "New Message Sent",
  description: "Emit new event when a new bot message is sent. [See the documentation](https://support.snatchbot.me/reference/get-message)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    snatchbot,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    userId: {
      propDefinition: [
        snatchbot,
        "userId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const messages = await this.getMessages();
      if (!messages.length) {
        return;
      }
      this.processMessages(messages.slice(0, 25));
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: message.message,
        ts: Date.parse(message.date),
      };
    },
    async getMessages() {
      const { messages } = await this.snatchbot.listMessages({
        params: {
          user_id: this.userId,
          message_id: 0,
        },
      });
      return messages;
    },
    processMessages(messages) {
      const lastTs = this._getLastTs();
      let maxLastTs = lastTs;

      for (const message of messages) {
        const ts = Date.parse(message.date);
        if (ts > lastTs) {
          const meta = this.generateMeta(message);
          this.$emit(message, meta);
          if (ts > maxLastTs) {
            maxLastTs = ts;
          }
        } else {
          break;
        }
      }

      this._setLastTs(maxLastTs);
    },
  },
  async run() {
    const messages = await this.getMessages();
    if (!messages.length) {
      return;
    }
    this.processMessages(messages);
  },
};
