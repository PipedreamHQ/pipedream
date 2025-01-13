import messagebird from "../../message_bird.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "message_bird-new-sms-message-received",
  name: "New SMS Message Received",
  description: "Emit new event when a new SMS message is received. [See the documentation](https://developers.messagebird.com/api/sms-messaging/#list-messages)",
  version: "0.0.1",
  dedupe: "unique",
  type: "source",
  props: {
    messagebird,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: `New Message ID: ${message.id}`,
        ts: Date.parse(message.createdDatetime),
      };
    },
  },
  async run() {
    let lastTs = this._getLastTs();

    const { items } = await this.messagebird.listSMSMessages({
      params: {
        direction: "mo", // mt = sent, mo = received
        type: "sms",
        from: lastTs,
      },
    });

    if (!items?.length) {
      return;
    }

    for (const message of items) {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);

      if (!lastTs || Date.parse(message.createdDatetime) > Date.parse(lastTs)) {
        lastTs = message.createdDatetime;
      }
    }

    this._setLastTs(lastTs);
  },
};
