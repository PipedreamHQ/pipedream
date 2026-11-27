import { ConfigurationError } from "@pipedream/platform";
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
    async getRecords() {
      const subscribers = await this.dpd2.listAll({
        fn: this.dpd2.listSubscribers,
        storefrontId: this.storefrontId,
        maxPages: Infinity,
      });
      // The API returns the same 404 for a store with no subscribers and for
      // one that's gone, so an empty list checks the store is still there
      if (!subscribers.length && !await this.dpd2.getStorefront({
        storefrontId: this.storefrontId,
      })) {
        throw new ConfigurationError(`DPD store ${this.storefrontId} wasn't found. It may have been deleted. Choose another store.`);
      }
      return subscribers;
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
