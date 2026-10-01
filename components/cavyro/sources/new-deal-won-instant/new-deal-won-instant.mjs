import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cavyro-new-deal-won-instant",
  name: "New Deal Won (Instant)",
  description: "Emit new event when a deal is marked as won in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "deal.won",
      ];
    },
    getSummary({ data }) {
      return `Deal won: ${data.title}`;
    },
  },
  sampleEmit,
};
