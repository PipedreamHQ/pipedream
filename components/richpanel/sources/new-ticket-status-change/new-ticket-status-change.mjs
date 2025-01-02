import { STATUS_OPTIONS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "richpanel-new-ticket-status-change",
  name: "New Ticket Status Change",
  description: "Emit a new event when a ticket's status is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    status: {
      type: "string",
      label: "Status",
      description: "The status of the ticket",
      options: STATUS_OPTIONS,
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "updated_at";
    },
    getParams() {
      return {
        status: this.status,
      };
    },
    getSummary(item) {
      return  `Ticket ${item.id} status changed to ${item.status}`;
    },
  },
  sampleEmit,
};
