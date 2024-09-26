import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "fidel_api-card-linked",
  name: "New Card Linked (Instant)",
  description: "Emit new event each time a new card is linked to the Fidel API.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "card.linked";
    },
    getSummary(body) {
      return `New card linked: ${body.firstNumbers}****${body.lastNumbers}`;
    },
  },
  sampleEmit,
};
