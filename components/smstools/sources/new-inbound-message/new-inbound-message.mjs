import smstools from "../../smstools.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "smstools-new-inbound-message",
  name: "New Inbound Message",
  description: "Emits new event when a new inbound message is received. [See the documentation](https://www.smstools.com/en/sms-gateway-api/get_inbox_all)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    smstools,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
      },
    },
  },
  methods: {
    _getLastMessageId() {
      return this.db.get("lastMessageId");
    },
    _setLastMessageId(id) {
      this.db.set("lastMessageId", id);
    },
  },
  hooks: {
    async deploy() {
      const messages = await this.smstools.getInboxMessages({
        params: {
          limit: 50,
        },
      });

      messages.slice(0, 50).forEach((msg) => {
        this.$emit(msg, {
          id: msg.ID,
          summary: `New inbound message from ${msg.sender}`,
          ts: new Date(msg.date).getTime(),
        });
      });

      const lastMessage = messages[0];
      if (lastMessage) {
        this._setLastMessageId(lastMessage.ID);
      }
    },
  },
  async run() {
    const lastMessageId = this._getLastMessageId();
    const messages = await this.smstools.getInboxMessages({
      params: {
        after_id: lastMessageId,
      },
    });

    messages.forEach((msg) => {
      this.$emit(msg, {
        id: msg.ID,
        summary: `New inbound message from ${msg.sender}`,
        ts: new Date(msg.date).getTime(),
      });
    });

    const lastMessage = messages[0];
    if (lastMessage) {
      this._setLastMessageId(lastMessage.ID);
    }
  },
};
