import common from "../common/polling.mjs";

export default {
  ...common,
  key: "prodpad-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a new contact is created. [See the docs](https://app.swaggerhub.com/apis-docs/ProdPad/prodpad/1.0#/Feedback/GetContacts).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getRequestResourcesFn() {
      return this.app.listContacts;
    },
    getResourceName() {
      return "contacts";
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Contact ${resource.id}`,
      };
    },
  },
};
