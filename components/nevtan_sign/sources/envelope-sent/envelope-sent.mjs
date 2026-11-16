import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import { getEnvelopeId } from "../../common/utils.mjs";
import sampleEmit from "./test-event.mjs";

const {
  DRAFT, SENT, IN_PROGRESS,
} = constants.ENVELOPE_STATUS;

export default {
  ...common,
  key: "nevtan_sign-envelope-sent",
  name: "New Envelope Sent",
  description: "Emit new event when an envelope is sent to its recipients for signing. [See the documentation](https://sign.nevtan.com/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    /**
     * An envelope counts as sent when its status is SENT or IN_PROGRESS, or
     * when it has already moved on (completed, declined, voided, on hold)
     * and `mail_sent` shows invitations went out. The second case covers
     * envelopes that are sent and finished between two polls; self-signed
     * envelopes complete without ever being sent, so status alone is not
     * enough there.
     */
    hasBeenSent(envelope) {
      if ([
        SENT,
        IN_PROGRESS,
      ].includes(envelope.status)) {
        return true;
      }
      return envelope.status !== DRAFT && envelope.mail_sent === true;
    },
    isRelevant(envelope, previousStatus) {
      const wasNotSent = previousStatus === undefined || previousStatus === DRAFT;
      return wasNotSent && this.hasBeenSent(envelope);
    },
    /**
     * Keyed on the envelope alone: an envelope is sent once, and the status
     * and timestamp differ depending on how late the poll catches it.
     */
    getEventIdParts(envelope) {
      return [
        getEnvelopeId(envelope),
        "sent",
      ];
    },
    getSummary(envelope) {
      return `Envelope sent: ${envelope.title || getEnvelopeId(envelope)}`;
    },
  },
  sampleEmit,
};
