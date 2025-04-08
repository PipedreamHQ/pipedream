import common from "../common/polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cliniko-new-contact-created",
  name: "New Contact Created",
  description: "Emit new event when a contact is created in Cliniko.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceName() {
      return "contacts";
    },
    getResourcesFn() {
      return this.app.listContacts;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
  sampleEmit,
};
