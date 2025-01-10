import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "motive-new-hours-of-service-violation-instant",
  name: "New Hours of Service Violation (Instant)",
  description: "Emit new event when a driver commits a violation related to hours of service (HOS).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getActions() {
      return [
        "hos_violation_upserted",
      ];
    },
    filterEvent(event) {
      return event.trigger === "created";
    },
    getSummary(violation) {
      return `New HOS Violation for Driver ID: ${violation.driver.id}`;
    },
  },
  sampleEmit,
};
