import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "eventzilla-new-event-transaction",
  name: "New Event Transaction",
  description: "Emit new event when a new transaction occurs for an event in Eventzilla. [See the documentation](https://developer.eventzilla.net/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    eventId: {
      propDefinition: [
        common.props.eventzilla,
        "eventId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.eventzilla.listEventTransactions;
    },
    getArgs() {
      return {
        eventId: this.eventId,
      };
    },
    getResourceKey() {
      return "transactions";
    },
    getSummary(item) {
      return `New Event Transaction ID: ${item.checkout_id}`;
    },
    generateMeta(item) {
      return {
        id: item.checkout_id,
        summary: this.getSummary(item),
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
