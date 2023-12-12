import base from "../common/base.mjs";

export default {
  ...base,
  key: "formstack-new-form-submission",
  name: "New Form Submission (Instant)",
  description: "Emit new event for each new form submission. [See docs here](https://formstack.readme.io/docs/form-id-webhook-post)",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    async emitEvent(event) {
      const { body } = event;

      if (!body.UniqueID) return;

      this.$emit(body, {
        id: body.UniqueID,
        summary: "New form submission",
        ts: new Date(),
      });
    },
  },
};
