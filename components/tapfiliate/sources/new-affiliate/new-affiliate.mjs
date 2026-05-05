import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "tapfiliate-new-affiliate",
  name: "New Affiliate",
  description: "Emit new event when a new affiliate is created. The affiliate is signed up or added by you. [See the documentation](https://tapfiliate.com/docs/rest/#affiliates-affiliates-collection-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.tapfiliate.listAffiliates;
    },
    getSummary(item) {
      return `New Affiliate: ${item.firstname} ${item.lastname}`;
    },
  },
  sampleEmit,
};
