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
    // The API has no date filter for subscribers, so this reads every page
    getRecords() {
      return this.dpd2.listAll({
        fn: this.dpd2.listSubscribers,
        storefrontId: this.storefrontId,
        maxPages: Infinity,
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
