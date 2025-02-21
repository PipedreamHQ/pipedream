import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "formaloo-form-submitted-instant",
  name: "Form Submitted (Instant)",
  description: "Emit new event when a form is submitted. [See the documentation](https://help.formaloo.com/en/articles/8568748-how-formaloo-webhook-works).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getData() {
      return {
        form_submit_events: true,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.event_id,
        summary: `Form Submitted: ${resource.event_id}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
