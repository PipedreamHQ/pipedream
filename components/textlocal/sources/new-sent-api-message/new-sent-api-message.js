const textlocal = require("../../textlocal.app");

module.exports = {
  key: "textlocal-new-sent-api-message",
  name: "New Sent API Message",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    textlocal,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
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
    _getMaskedNumber(number) {
      const numberAsString = Number(number).toString();
      const { length: numberLength } = numberAsString;
      return numberAsString
        .slice(numberLength - 4)
        .padStart(numberLength, "#");
    },
    generateMeta(message) {
      const {
        id,
        datetime,
        number,
        sender,
      } = message;
      const maskedNumber = this._getMaskedNumber(number);
      const summary = `New message from ${sender} to ${maskedNumber}`;
      const ts = Date.parse(datetime);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const latestMessageId = this.db.get("latestMessageId");
    const messageScan = await this.textlocal.scanApiMessageHistory(latestMessageId);

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
      ...messages.map(({ id }) => id)
    ).toString();
    this.db.set("latestMessageId", newLatestMessageId);
  },
};
