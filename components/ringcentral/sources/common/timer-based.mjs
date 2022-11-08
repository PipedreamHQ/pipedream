import base from "./base.mjs";

export default {
  ...base,
  dedupe: "unique",
  props: {
    ...base.props,
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "The timer that will trigger the event source",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  hooks: {
    activate() {
      const threeHours = 60 * 60 * 3;
      const lastTimestamp = Math.floor(Date.now() / 1000) - threeHours;
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
    const threeMinutes = 60 * 3;
    const dateFrom = this._timestampToIsoString(lastTimestamp - threeMinutes);

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
