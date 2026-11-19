import common from "../common/webhook.mjs";
import {
  DOCS_URLS, EVENT_TYPES,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pdfgate-envelope-sent-instant",
  name: "New Envelope Sent",
  description: `Emit new event when a PDFGate envelope is sent to its recipients and signing has begun. [See the documentation](${DOCS_URLS.webhookEvents})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return EVENT_TYPES.ENVELOPE_SENT;
    },
  },
  sampleEmit,
};
