import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-watch-voice-messages",
  name: "Watch Voice Messages",
  description: "Emits an event each time a new voice message is received or sent.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    clicksend,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        message_id, timestamp,
      } = data;
      const ts = Date.parse(timestamp);
      return {
        id: message_id,
        summary: `New voice message with ID: ${message_id}`,
        ts,
      };
    },
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp") || this.clicksend.monthAgo();
    const messages = await this.clicksend.emitVoiceMessageEvent();
    for (const message of messages) {
      if (Date.parse(message.timestamp) > Date.parse(lastProcessedTimestamp)) {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      }
    }
    this.db.set("lastProcessedTimestamp", new Date().toISOString());
  },
};
