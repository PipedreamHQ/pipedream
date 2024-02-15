import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-email-event",
  name: "New Email Event",
  description: "Emit new event for each new Hubspot email event.",
  version: "0.0.16",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    getTs(emailEvent) {
      return Date.parse(emailEvent.created);
    },
    generateMeta(emailEvent) {
      const {
        id,
        recipient,
        type,
      } = emailEvent;
      const ts = this.getTs(emailEvent);
      return {
        id,
        summary: `${recipient} - ${type}`,
        ts,
      };
    },
    getParams() {
      const startTimestamp = new Date();
      return {
        limit: 100,
        startTimestamp,
      };
    },
    async processResults(after, params) {
      await this.paginateUsingHasMore(
        params,
        this.hubspot.getEmailEvents.bind(this),
        "events",
      );
    },
  },
};
