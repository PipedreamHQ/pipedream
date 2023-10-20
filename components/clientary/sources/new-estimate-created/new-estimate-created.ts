import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-estimate-created",
  name: "New Estimate Created",
  description: "Emit new events when a new estimate was created. [See the docs](https://www.clientary.com/api/estimates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getEstimates",
        resourceName: "estimates",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New estimate ${item.total_cost}${item.currency_code} ID(${item.id})`;
    },
  },
});
