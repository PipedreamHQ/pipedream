import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "iauditor_by_safetyculture-inspection-completed",
  name: "Inspection Completed",
  description: "Emit new event when an inspection has completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "TRIGGER_EVENT_INSPECTION_COMPLETED";
    },
    generateMeta({ audit }) {
      return {
        id: audit.audit_id,
        summary: `New Inspection Completed ${audit.audit_id}`,
        ts: Date.parse(audit.audit_data.date_completed),
      };
    },
  },
  sampleEmit,
};
