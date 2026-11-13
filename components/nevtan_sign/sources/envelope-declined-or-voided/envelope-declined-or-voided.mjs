import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

const { REJECTED } = constants.ENVELOPE_STATUS;

export default {
  ...common,
  key: "nevtan_sign-envelope-declined-or-voided",
  name: "New Envelope Declined or Voided",
  description: "Emit new event when a signer declines an envelope or the sender voids it. NevTan Sign reports both with the same status; when a signer declined, their participant entry has a `rejected_reason`.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(envelope, previousStatus) {
      return envelope.status === REJECTED && previousStatus !== REJECTED;
    },
    getSummary(envelope) {
      return `Envelope declined or voided: ${envelope.title || this.nevtanSign.getEnvelopeId(envelope)}`;
    },
  },
  sampleEmit,
};
