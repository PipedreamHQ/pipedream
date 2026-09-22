import common from "../common/base-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cloudbeds-new-transaction-created",
  name: "New Transaction Created (Instant)",
  description: "Emit new event when a new transaction is created in Cloudbeds. [See the documentation](https://developers.cloudbeds.com/reference/post_postwebhook-2)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getObject() {
      return "accounting";
    },
    getAction() {
      return "transaction";
    },
    generateMeta(body) {
      return {
        id: body.transactionId,
        summary: `New transaction created with ID: ${body.transactionId}`,
        ts: Date.parse(body.transactionDateTime),
      };
    },
  },
  sampleEmit,
};
