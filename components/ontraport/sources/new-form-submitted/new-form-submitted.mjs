import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "ontraport-new-form-submitted",
  name: "New Form Submitted (Instant)",
  description: "Emit new event when a new form is submitted. [See the docs](https://api.ontraport.com/doc/#form-is-submitted).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.app,
        "formId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return `${events.OBJECT_SUBMITS_FORM}(${this.formId})`;
    },
    generateMeta(body) {
      const { data } = body;
      return {
        id: data.id,
        summary: `New Form ${data.id}`,
        ts: body.timestamp,
      };
    },
  },
};
