import app from "../../sperse.app.mjs";
import common from "../common/polling.mjs";

export default {
  ...common,
  key: "sperse-new-subscription",
  name: "New Subscription",
  description: "Emit new event when a new subscription is created. [See the documentation](https://app.sperse.com/app/api/swagger)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getSubscriptionHistory;
    },
    getResourceFnArgs() {
      return {
        params: {
          contactId: this.contactId,
        },
      };
    },
    generateMeta(subscription) {
      return {
        id: subscription.id,
        summary: `New Subscription: ${subscription.productName || subscription.productCode}`,
        ts: Date.now(),
      };
    },
  },
};
