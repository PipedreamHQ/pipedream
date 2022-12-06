import common from "../common.mjs";

export default {
  ...common,
  key: "hubspot-new-email-subscriptions-timeline",
  name: "New Email Subscriptions Timeline",
  description: "Emit new event when new email timeline subscription added for the portal.",
  version: "0.0.5",
  dedupe: "unique",
  type: "source",
  hooks: {},
  methods: {
    ...common.methods,
    generateMeta(timeline) {
      const {
        normalizedEmailId: id,
        timestamp: ts,
      } = timeline;
      return {
        id: `${id}${ts}`,
        summary: `New subscription event for recipient ${id}`,
        ts,
      };
    },
    isRelevant(timeline, createdAfter) {
      return timeline.timestamp > createdAfter;
    },
    getParams() {
      const startTimestamp = new Date();
      return {
        startTimestamp,
      };
    },
    async processResults(after, params) {
      await this.paginateUsingHasMore(
        params,
        this.hubspot.getEmailSubscriptionsTimeline.bind(this),
        "timeline",
        after,
      );
    },
  },
};
