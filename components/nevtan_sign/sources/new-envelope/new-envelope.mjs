import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nevtan_sign-new-envelope",
  name: "New Envelope",
  description: "Emit new event when an envelope is created in the workspace, or when an envelope sent to you by someone else first appears.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(envelope, previousStatus) {
      return previousStatus === undefined;
    },
    getTimestamp(envelope) {
      return Date.parse(envelope.created_at) || Date.now();
    },
    getDedupeId(envelope) {
      return this.nevtanSign.getEnvelopeId(envelope);
    },
    getSummary(envelope) {
      return `New envelope: ${envelope.title || this.nevtanSign.getEnvelopeId(envelope)}`;
    },
  },
  sampleEmit,
};
