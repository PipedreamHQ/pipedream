import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

const { COMPLETED } = constants.ENVELOPE_STATUS;

export default {
  ...common,
  key: "nevtan_sign-envelope-completed",
  name: "New Envelope Completed",
  description: "Emit new event when every signer has signed an envelope and it is marked completed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(envelope, previousStatus) {
      return envelope.status === COMPLETED && previousStatus !== COMPLETED;
    },
    getTimestamp(envelope) {
      return Date.parse(envelope.signed_at || envelope.updated_at || envelope.created_at)
        || Date.now();
    },
    getSummary(envelope) {
      return `Envelope completed: ${envelope.title || this.nevtanSign.getEnvelopeId(envelope)}`;
    },
  },
  sampleEmit,
};
