import base from "../common/base.mjs";
import eventTypes from "../common/event-types.mjs";

export default {
  ...base,
  key: "mautic-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a form is submitted. [See the docs](https://developer.mautic.org/#webhooks)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return eventTypes.FORM_SUBMITTED;
    },
    generateMeta(form) {
      const {
        id,
        name,
        dateAdded: ts,
      } = form;
      return {
        id,
        ts,
        summary: `New form: ${name}`,
      };
    },
    emitEvent(event) {
      const { form } = event;
      const meta = this.generateMeta(form);
      console.log(`Emitting event - ${meta.summary}`);
      this.$emit(form, meta);
    },
  },
};
