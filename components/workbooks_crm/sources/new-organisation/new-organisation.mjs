import common from "../common-webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "workbooks_crm-new-organisation",
  name: "New Organisation (Instant)",
  description: "Emit new event when a new organisation is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getOrganisations;
    },
    getResourceName() {
      return "organisation";
    },
    getTriggerId() {
      return constants.TRIGGER_ID.NEW_ORGANISATION;
    },
    getMetadata(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Organisation ID ${resource.id}`,
      };
    },
  },
};
