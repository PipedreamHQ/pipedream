import confection from "../confection.app.mjs";

export default {
  props: {
    confection,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
    db: "$.service.db",
  },
  methods: {
    /**
     * Get last timestamp from Pipedream DB
     *
     * @returns {number}
     */
    getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    /**
     * Set last timestamp in Pipedream DB
     *
     * @param {number} timestamp - Timestamp
     */
    setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    /**
     * Get summary for the triggered event
     *
     * @param {string} uuid - Emitted data UUID
     */
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
    /**
     * Get data from Confection Live API
     *
     * @param {string} lastTimestamp - Start of results time frame
     * @param {string} timestamp - End of results time frame
     */
    getSourceData() {
      throw new Error("getSourceData is not implemented");
    },
  },
  async run(event) {
    const intervalSeconds = event.interval_seconds || 15 * 60;
    const timestamp = event.timestamp || Math.round(Date.now() / 1000);
    const lastTimestamp =
      this.getLastTimestamp() || timestamp - intervalSeconds;
    const data = await this.getSourceData(lastTimestamp, timestamp);

    this.setLastTimestamp(timestamp);
    Object.entries(data).forEach(([
      key,
      value,
    ]) => {
      const id = `${key}-${value.updated_time}`;

      this.$emit(
        {
          ...value,
          UUID: key,
        },
        {
          id,
          summary: this.getSummary(key),
          ts: value.updated_time * 1000,
        },
      );
    });
  },
};
