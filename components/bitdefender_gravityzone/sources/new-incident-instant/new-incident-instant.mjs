import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "bitdefender_gravityzone-new-incident-instant",
  name: "New Incident (Instant)",
  description: "Emit new event when a new Root Cause Analysis (RCA) is displayed under the Incidents section of Control Center.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventTypes() {
      return {
        "new-incident": true,
      };
    },
    generateMeta(item) {
      return {
        id: item.incident_id,
        summary: `New Incident with ID: ${item.incident_id}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
