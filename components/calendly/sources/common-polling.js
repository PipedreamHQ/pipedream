const calendly = require("../calendly.app.js");

module.exports = {
  props: {
    calendly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    _getLastEvent() {
      const lastEvent = this.db.get("lastEvent") || this.calendly.monthAgo();
      return lastEvent;
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
  },
  async run(event) {
    const lastEvent = this._getLastEvent();

    const results = await this.getResults();
    for (const result of results) {
      if (this.isRelevant(result, lastEvent)) {
        const meta = this.generateMeta(result);
        this.$emit(result, meta);
      }
    }

    this._setLastEvent(Date.now());
  },
};