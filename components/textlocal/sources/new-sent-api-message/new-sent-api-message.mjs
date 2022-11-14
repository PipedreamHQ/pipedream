import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "textlocal-new-sent-api-message",
  name: "New Sent API Message",
  description: "Emit new message sent via Textlocal's API",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async activate() {
      let latestMessageId = this.db.get("latestMessageId");
      if (!latestMessageId) {
        latestMessageId = await this.textlocal.getLatestMessageId();
        this.db.set("latestMessageId", latestMessageId);
      }

      console.log(`Starting scanning from message ID: ${latestMessageId}`);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(message) {
      const {
        id,
        datetime,
        number,
        sender,
      } = message;
      const maskedNumber = this.getMaskedNumber(number);
      const summary = `New message from ${sender} to ${maskedNumber}`;
      const ts = Date.parse(datetime);
      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent() {
      const latestMessageId = this.db.get("latestMessageId");
      const messageScan = await this.textlocal.scanApiMessageHistory({
        lowerBoundMessageId: latestMessageId,
      });

      const messages = [];
      for await (const message of messageScan) {
        messages.push(message);
      }

      if (messages.length === 0) {
        console.log("No new messages detected. Skipping...");
        return;
      }

      messages.reverse().forEach((message) => {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      });

      const newLatestMessageId = Math.max(
        ...messages.map(({ id }) => id),
      ).toString();
      this.db.set("latestMessageId", newLatestMessageId);
    },
  },
};
