import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-payment-created",
  name: "New Payment Created",
  description: "Emit new events when a new payment was created. [See the docs](https://www.clientary.com/api/payments)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getPayments",
        resourceName: "payments",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New payment ${item.amount} ID(${item.id})`;
    },
  },
});
