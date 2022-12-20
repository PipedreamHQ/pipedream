import common from "../common/webhook.mjs";
import constants from "../common/constants.mjs";

export default {
  ...common,
  key: "shopify-updated-customer",
  name: "Updated Customer (Instant)", /* eslint-disable-line pipedream/source-name */
  type: "source",
  description: "Emit new event each time a customer's information is updated.",
  version: "0.0.9",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopic() {
      return constants.EVENT_TOPIC.CUSTOMERS_UPDATE;
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.updated_at);
      return {
        id: ts,
        summary: `Customer Updated ${resource.id}.`,
        ts,
      };
    },
  },
};
