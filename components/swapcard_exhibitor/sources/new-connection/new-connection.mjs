import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "swapcard_exhibitor-new-connection",
  name: "New Connection Formed",
  description: "Emit new event when a new connection is formed (new lead).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getFunction() {
      return this.swapcardExhibitor.getEventPeople;
    },
    getDate(item) {
      return item.registration.registeredAt;
    },
    getFilters(lastDate) {
      return [
        {
          lastUpdatedSince: lastDate,
          sources: "REGISTRATION",
        },
      ];
    },
    getType() {
      return "eventPerson";
    },
    getSummary(lead) {
      return `New connection: ${lead.firstName} ${lead.lastName}`;
    },
  },
  sampleEmit,
};
