import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "boloforms-new-template-response-instant",
  name: "New Template Response (Instant)",
  description: "Emit new event when a new form template response is filled.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    documentId: {
      propDefinition: [
        common.props.boloforms,
        "documentId",
        () => ({
          isStandAloneTemplate: true,
        }),
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvent() {
      return "new_template_response";
    },
    getSummary(body) {
      return `New response for template ID ${body.documentId}`;
    },
  },
  sampleEmit,
};
