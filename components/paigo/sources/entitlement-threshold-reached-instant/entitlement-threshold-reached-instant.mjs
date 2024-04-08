import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "paigo-entitlement-threshold-reached-instant",
  name: "Entitlement Threshold Reached (Instant)",
  description: "Emit new event when customers' usage reaches a threshold of 80% or 100% of their offerings. [See the documentation](http://www.api.docs.paigo.tech/#tag/Webhooks/operation/Subscribe%20a%20Webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    offeringId: {
      propDefinition: [
        common.props.paigo,
        "offeringId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getWebhookType() {
      return "ENTITLEMENT";
    },
    generateMeta(event) {
      const ts = Date.parse(event.timestamp);
      return {
        id: `${event.customerId}-${ts}`,
        summary: `Entitlement threshold reached for customer ${event.customerId}`,
        ts,
      };
    },
  },
  sampleEmit,
};
