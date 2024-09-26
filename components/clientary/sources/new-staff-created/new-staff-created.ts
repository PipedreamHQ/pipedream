import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-staff-created",
  name: "New Staff Created",
  description: "Emit new events when a new staff was created. [See the docs](https://www.clientary.com/api/staff)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getStaff",
        resourceName: "staff",
        hasPaging: false,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New staff ${item.name} ID(${item.id})`;
    },
  },
});
