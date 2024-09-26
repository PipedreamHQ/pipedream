import common from "../common-webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "workbooks_crm-posted-invoice",
  name: "New Posted Invoice (Instant)",
  description: "Emit new event when a new invoice is posted.",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getInvoices;
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
      return "invoice";
    },
    getTriggerId() {
      return constants.TRIGGER_ID.POSTED_INVOICE;
    },
    getMetadata(resource) {
      return {
        id: resource.id,
        ts: Date.parse(resource.created_at),
        summary: `New Invoice ID ${resource.id}`,
      };
    },
  },
};
