import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import signalwire from "../../signalwire.app.mjs";

export default {
  key: "signalwire-new-text-message",
  name: "New Text Message",
  description: "Emit new event when a new text message arrives",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signalwire,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastMessageId() {
      return this.db.get("last_message_id");
    },
    _setLastMessageId(id) {
      this.db.set("last_message_id", id);
    },
  },
  async run() {
    const lastMessageId = this._getLastMessageId();
    let newLastMessageId = lastMessageId;

    const messages = await this.signalwire.listTextMessageLogs();
    for (const message of messages) {
      if (message.id !== lastMessageId) {
        this.$emit(message, {
          id: message.id,
          summary: `New message from ${message.from} to ${message.to}`,
          ts: new Date(message.created_at).getTime(),
        });
        newLastMessageId = message.id;
      } else {
        break;
      }
    }

    this._setLastMessageId(newLastMessageId);
  },
};
