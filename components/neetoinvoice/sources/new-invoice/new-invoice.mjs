import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "neetoinvoice-new-invoice",
  name: "New Invoice (Instant)",
  description: "Emit new event when there is a new invoice. [See the documentation](https://help.neetoinvoice.com/articles/neetoinvoice-zapier-integration)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "new_invoice";
    },
    getFunction() {
      return this.neetoinvoice.listInvoices;
    },
    getDataToEmit(body) {
      return {
        id: body.id,
        summary: `A new invoice with Id: ${body.id} has been created!`,
        ts: new Date(body.createdAt),
      };
    },
  },
  sampleEmit,
};
