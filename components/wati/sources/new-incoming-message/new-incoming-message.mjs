import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "wati-new-incoming-message",
  name: "New Incoming Message",
  description: "Emit new event when there is an incoming message on your number.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.wati,
        "contactId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getOpts() {
      return {
        whatsappNumber: `+${this.contactId}`,
      };
    },
    getDateField() {
      return "timestamp";
    },
    getItemsField() {
      return [
        "messages",
        "items",
      ];
    },
    filterItems(item) {
      return item.statusString === "SENT";
    },
    checkBreak(item, lastDate) {
      return Date.parse(item.timestamp) < lastDate;
    },
    getFunction() {
      return this.wati.listContactMessages;
    },
    getSummary(item) {
      return `New message: ${item.text || "No content"}`;
    },
  },
  sampleEmit,
};
