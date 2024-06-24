import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-email-subscriptions-timeline",
  name: "New Email Subscriptions Timeline",
  description: "Emit new event when a new email timeline subscription is added for the portal.",
  version: "0.0.14",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getTs(timeline) {
      return timeline.timestamp;
    },
    generateMeta(timeline) {
      const { recipient: id } = timeline;
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
    getParams(after) {
      return {
        params: {
          startTimestamp: after,
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
  sampleEmit,
};
