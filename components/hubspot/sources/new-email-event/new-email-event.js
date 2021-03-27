const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emits an event for each new Hubspot email event.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(emailEvent) {
      const { id, recipient, type, created } = emailEvent;
      const ts = Date.parse(created);
      return {
        id,
        summary: `${recipient} - ${type}`,
        ts,
      };
    },
    emitEvent(emailEvent) {
      const meta = this.generateMeta(emailEvent);
      this.$emit(emailEvent, meta);
    },
    isRelevant(emailEvent, createdAfter = null) {
      return true;
    },
  },
  async run(event) {
    const startTimestamp = Date.parse(this.hubspot.monthAgo());
    const params = {
      limit: 100,
      startTimestamp,
    };

    await this.paginateUsingHasMore(
      params,
      this.hubspot.getEmailEvents.bind(this),
      "events"
    );
  },
};