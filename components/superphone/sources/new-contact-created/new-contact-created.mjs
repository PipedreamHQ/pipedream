import common from "../common/webhook.mjs";
import subscriptions from "../common/subscriptions.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "superphone-new-contact-created",
  name: "New Contact Created",
  description: "Triggered when a new contact is created. [See the documentation](https://api.superphone.io/docs/webhooksubscription.doc.html)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listContacts;
    },
    getResourcesFnArgs() {
      return {
        first: constants.DEFAULT_LIMIT,
      };
    },
    getResourcesName() {
      return "contacts";
    },
    getSubscriptions() {
      return [
        subscriptions.CONTACT_ADDED,
      ];
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Contact: ${resource.id}`,
        ts: Date.parse(resource.createdAt),
      };
    },
  },
};
