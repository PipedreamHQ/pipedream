import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "guru-new-card-instant",
  name: "New Card Created (Instant)",
  description: "Emit new event when a new card is published. [See the documentation](https://developer.getguru.com/docs/creating-a-webhook)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "card-created";
    },
    getSummary(body) {
      return `New Card: ${body.properties.cardId}`;
    },
  },
  sampleEmit,
};
