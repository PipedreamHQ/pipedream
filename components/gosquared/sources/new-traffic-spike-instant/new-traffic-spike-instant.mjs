import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gosquared-new-traffic-spike-instant",
  name: "New Traffic Spike (Instant)",
  description: "Emit new event when a traffic spike is detected in GoSquared.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "traffic_spike";
    },
    generateMeta(body) {
      return {
        id: body.triggeredAlert.id,
        summary: `Traffic spike detected: ${body.triggeredAlert.value} visitors ${body.triggeredAlert.type} (${body.triggeredAlert.boundary})`,
        ts: body.snapshot.time.time,
      };
    },
  },
  sampleEmit,
};

