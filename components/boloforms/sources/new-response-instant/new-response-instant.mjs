import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "boloforms-new-response-instant",
  name: "New Response (Instant)",
  description: "Emit new event when a filled form response is received.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.boloforms,
        "formId",
      ],
      withLabel: true,
    },
  },
  methods: {
    ...common.methods,
    getWebhookEvent() {
      return "new_form_response";
    },
    getDocs() {
      return this.formId;
    },
    generateMeta(body) {
      return {
        id: body.formResponseId,
        summary: `New response for form ID: ${body.formId}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
