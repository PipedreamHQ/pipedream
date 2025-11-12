import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "aidbase-new-ticket-form-knowledge-item",
  name: "New Ticket Form Knowledge Item",
  description: "Emit new event when a new knowledge item is added to a ticket form.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    ticketFormId: {
      propDefinition: [
        common.props.aidbase,
        "ticketFormId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.aidbase.listTicketFormKnowledgeItems;
    },
    getArgs() {
      return {
        ticketFormId: this.ticketFormId,
      };
    },
  },
  sampleEmit,
};
