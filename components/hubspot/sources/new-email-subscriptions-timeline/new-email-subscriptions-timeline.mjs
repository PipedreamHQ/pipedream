import common from "../common/common.mjs";

export default {
  ...common,
  key: "hubspot-new-email-subscriptions-timeline",
  name: "New Email Subscriptions Timeline",
  description: "Emit new event when new email timeline subscription added for the portal.",
  version: "0.0.14",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTs(timeline) {
      return timeline.timestamp;
    },
    generateMeta(timeline) {
      const { normalizedEmailId: id } = timeline;
      const ts = this.getTs(timeline);
      return {
        id: `${id}${ts}`,
        summary: `New subscription event for recipient ${id}`,
        ts,
      };
    },
    isRelevant(timeline, createdAfter) {
      return this.getTs(timeline) > createdAfter;
    },
    getParams() {
      const startTimestamp = new Date();
      return {
        params: {
          startTimestamp,
        },
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
