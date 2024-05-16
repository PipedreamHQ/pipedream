import common from "../common/polling.mjs";

export default {
  ...common,
  key: "insighto_ai-new-contact",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created in Insighto AI. [See the documentation](https://api.insighto.ai/docs#/contact/read_contact_list_api_v1_contact_list_get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "data.items";
    },
    getResourcesFn() {
      return this.app.listContacts;
    },
    getResourcesFnArgs($) {
      return {
        $,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.email}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
