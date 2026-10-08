import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cavyro-new-deal-stage-moved-instant",
  name: "New Deal Stage Change (Instant)",
  description: "Emit new event when a deal moves to another pipeline stage in Cavyro. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return [
        "deal.stage_moved",
      ];
    },
    getSummary({ data }) {
      return `Deal moved: ${data.title}`;
    },
  },
  sampleEmit,
};
