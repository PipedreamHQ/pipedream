const base = require("./base");

module.exports = {
  ...base,
  dedupe: "unique",
  props: {
    ...base.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    activate() {
      const lastTimestamp = Math.floor(Date.now() / 1000);
      this.db.set("lastTimestamp", lastTimestamp);
    },
    deactivate() {
      this.db.set("lastTimestamp", null);
    },
  },
  methods: {
    ...base.methods,
    _timestampToIsoString(timestamp) {
      const timestampInMillis = Math.floor(timestamp * 1000);
      return new Date(timestampInMillis).toISOString();
    },
    processEvent() {
      throw new Error("processEvent not implemented");
    },
  },
  async run(event) {
    const lastTimestamp = this.db.get("lastTimestamp");
    const dateFrom = this._timestampToIsoString(lastTimestamp);

    const { timestamp } = event;
    const dateTo = this._timestampToIsoString(timestamp);

    await this.processEvent({
      event,
      dateFrom,
      dateTo,
    });

    this.db.set("lastTimestamp", timestamp);
  },
};
