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
    getPaginateOpts() {
      return {
        fn: this.wati.listContactMessages,
        whatsappNumber: `+${this.contactId}`,
        itemsField: [
          "messages",
        ],
        optsField: "params",
      };
    },
    getDateField() {
      return "timestamp";
    },
    prepareData(data, lastDate, maxResults) {
      data = data
        .filter((item) => item.statusString === "SENT" && Date.parse(item.created) > lastDate)
        .sort((a, b) => Date.parse(b.created) - Date.parse(a.created));

      if (maxResults && data.length > maxResults) data.length = maxResults;
      return data;
    },
    checkBreak(item, lastDate) {
      return Date.parse(item.timestamp) < lastDate;
    },
    getSummary(item) {
      return `New message: ${item.text || "No content"}`;
    },
  },
  sampleEmit,
};
