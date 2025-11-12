import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "boloforms-new-signature-completed-instant",
  name: "New Signature Completed (Instant)",
  description: "Emit new event when a PDF document is fully signed. [See the documentation](https://help.boloforms.com/en/collections/8024362-webhooks)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    documentId: {
      propDefinition: [
        common.props.boloforms,
        "documentId",
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvent() {
      return "new_signature_completed";
    },
    getSummary(body) {
      return `Document ${body.documentId} fully signed`;
    },
  },
  sampleEmit,
};
