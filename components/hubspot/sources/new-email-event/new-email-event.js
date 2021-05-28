const common = require("../common.js");

module.exports = {
  ...common,
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emits an event for each new Hubspot email event.",
  version: "0.0.2",
  dedupe: "unique",
  hooks: {},
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
  },
  async run(event) {
    const startTimestamp = this._getAfter();
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