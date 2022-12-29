import { defineSource } from "@pipedream/types";
import common from "../common/common";

export default defineSource({
  ...common,
  key: "clientary-new-contact-created",
  name: "New Contact Created",
  description: "Emit new events when a new contact was created. [See the docs](https://www.clientary.com/api/contacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getConfig() {
      return {
        resourceFnName: "getContacts",
        resourceName: "contacts",
        hasPaging: true,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSummary(item: any): string {
      return `New contact ${item.name} ID(${item.id})`;
    },
  },
});
