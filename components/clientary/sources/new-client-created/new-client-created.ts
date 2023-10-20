import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-client-created",
  name: "New Client Created",
  description: "Emit new events when a new client was created. [See the docs](https://www.clientary.com/api/clients)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getClients",
        resourceName: "clients",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New client ${item.name} ID(${item.id})`;
    },
  },
});
