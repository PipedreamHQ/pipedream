import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "cats-new-candidate-instant",
  name: "New Candidate (Instant)",
  description: "Emit new event when a new candidate is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return [
        "candidate.created",
      ];
    },
    generateMeta(body) {
      const candidate = body._embedded.candidate;
      return {
        id: body.candidate_id,
        summary: `New candidate created: ${candidate.first_name} ${candidate.last_name} (${candidate.emails.primary || candidate.emails.second})`,
        ts: Date.parse(body.date || new Date()),
      };
    },
  },
  sampleEmit,
};
