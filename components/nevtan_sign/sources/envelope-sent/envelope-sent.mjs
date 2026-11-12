import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

const {
  DRAFT, SENT, IN_PROGRESS,
} = constants.ENVELOPE_STATUS;

export default {
  ...common,
  key: "nevtan_sign-envelope-sent",
  name: "New Envelope Sent",
  description: "Emit new event when an envelope is sent to its recipients for signing.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(envelope, previousStatus) {
      const isOut = [
        SENT,
        IN_PROGRESS,
      ].includes(envelope.status);
      const wasNotOut = previousStatus === undefined || previousStatus === DRAFT;
      return isOut && wasNotOut;
    },
    getSummary(envelope) {
      return `Envelope sent: ${envelope.title || this.nevtanSign.getEnvelopeId(envelope)}`;
    },
  },
  sampleEmit,
};
