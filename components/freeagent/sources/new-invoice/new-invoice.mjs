import { getId } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freeagent-new-invoice",
  name: "New Invoice",
  description: "Emit new event when a new invoice is created. [See the documentation](https://dev.freeagent.com/docs/invoices#list-all-invoices).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDataField() {
      return "invoices";
    },
    getFunction() {
      return this.freeagent.listInvoices;
    },
    getSummary(item) {
      return `New Invoice: ${getId(item.url)}`;
    },
  },
  sampleEmit,
};
