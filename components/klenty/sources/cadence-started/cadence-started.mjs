import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "klenty-cadence-started",
  name: "New Cadence Started",
  description: "Emit new event when a new cadence is started.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "startCadence";
    },
    getSummary(body) {
      return `New cadence started: ${body.email || body.fullName}`;
    },
  },
  sampleEmit,
};
