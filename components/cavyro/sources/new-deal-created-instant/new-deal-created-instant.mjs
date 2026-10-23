import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cavyro-new-deal-created-instant",
  name: "New Deal Created (Instant)",
  description: "Emit new event when a deal is created in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "deal.created",
      ];
    },
    getSummary({ data }) {
      return `New deal: ${data.title}`;
    },
  },
  sampleEmit,
};
