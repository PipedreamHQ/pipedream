import common from "../common-webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "workbooks_crm-posted-credit-note",
  name: "New Posted Credit Note (Instant)",
  description: "Emit new event when a new credit note is posted.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getCreditNotes;
    },
    getResourceFnArgs() {
      return {
        params: {
          _ff: [
            "status",
          ],
          _ft: [
            "eq",
          ],
          _fc: [
            "POSTED",
          ],
        },
      };
    },
    getResourceName() {
      return "creditnote";
    },
    getTriggerId() {
      return constants.TRIGGER_ID.POSTED_CREDIT_NOTE;
    },
    getMetadata(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Credit Note ID ${resource.id}`,
      };
    },
  },
};
