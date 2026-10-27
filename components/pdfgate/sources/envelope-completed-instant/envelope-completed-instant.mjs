import common from "../common/webhook.mjs";
import {
  DOCS_URL, EVENT_TYPES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pdfgate-envelope-completed-instant",
  name: "New Envelope Completed",
  description: `Emit new event when all recipients have signed a PDFGate envelope. [See the documentation](${DOCS_URL})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return EVENT_TYPES.ENVELOPE_COMPLETED;
    },
  },
  sampleEmit,
};
