import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "persistiq-new-prospect-created",
  name: "New Prospect Created",
  description: "Emit new events when a new prospect was created. [See the docs](https://apidocs.persistiq.com/#list-leads)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getLeads",
        resourceName: "leads",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New prospect ${item?.data?.email} ID(${item?.id})`;
    },
  },
});
