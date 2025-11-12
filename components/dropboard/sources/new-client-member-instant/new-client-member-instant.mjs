import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "dropboard-new-client-member-instant",
  name: "New Client Member (Instant)",
  description: "Emit new event when a member is added to a recruiting client (recruiter plan only).",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getPath() {
      return "clients/members";
    },
    getSummary(body) {
      return `New member added to client ${body.clientId}`;
    },
  },
  sampleEmit,
};
