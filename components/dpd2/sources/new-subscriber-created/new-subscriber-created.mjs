import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dpd2-new-subscriber-created",
  name: "New Subscriber Created",
  description: "Emit new event when someone signs up to one of your subscription (membership) stores. [See the documentation](https://docs.getdpd.com/api/reference/operations/listsubscribers/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    storefrontId: {
      propDefinition: [
        common.props.dpd2,
        "subscriptionStorefrontId",
      ],
    },
  },
  methods: {
    ...common.methods,
    // With no page, the API returns the whole list. It has no date filter.
    getRecords() {
      return this.dpd2.listSubscribers({
        storefrontId: this.storefrontId,
      });
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.id,
        summary: `New subscriber ${subscriber.username}`,
        ts: Number(subscriber.created_at) * 1000,
      };
    },
  },
  sampleEmit,
};
