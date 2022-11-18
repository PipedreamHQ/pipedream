import common from "../common-webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "workbooks_crm-new-person",
  name: "New Person (Instant)",
  description: "Emit new event when a new person is created.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getPeople;
    },
    getResourceName() {
      return "person";
    },
    getTriggerId() {
      return constants.TRIGGER_ID.NEW_PERSON;
    },
    getMetadata(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Person ID ${resource.id}`,
      };
    },
  },
};
