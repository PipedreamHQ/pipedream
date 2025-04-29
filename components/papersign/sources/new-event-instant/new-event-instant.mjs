import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "papersign-new-event-instant",
  name: "New Event in Papersign (Instant)",
  description: "Emit new event when any document or signer action occurs.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTriggers() {
      return [
        "document.sent",
        "document.completed",
        "document.cancelled",
        "document.rejected",
        "document.expired",
        "signer.notified",
        "signer.viewed",
        "signer.consent_accepted",
        "signer.nominated",
        "signer.signed",
      ];
    },
    getSummary({ data }) {
      return `New event: ${data.type}`;
    },
  },
  sampleEmit,
};
