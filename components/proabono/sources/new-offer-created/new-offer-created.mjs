import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "proabono-new-offer-created",
  name: "New Offer Created",
  description: "Emit new event when a new offer is created. [See the documentation](https://docs.proabono.com/api/#retrieve-offers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.proabono.listOffers;
    },
    generateMeta(offer) {
      return {
        id: offer.Id,
        summary: `New Offer ${offer.Name || offer.Id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
