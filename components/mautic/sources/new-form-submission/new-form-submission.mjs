import base from "../common/base.mjs";
import constants from "../common/constants.mjs";

export default {
  ...base,
  key: "mautic-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a form is submitted. [See the docs](https://developer.mautic.org/#webhooks)",
  version: "0.0.1",
  type: "source",
  props: {
    ...base.props,
    formId: {
      propDefinition: [
        base.props.mautic,
        "formId",
      ],
      description: "ID of the form to get submissions",
    },
  },
  methods: {
    ...base.methods,
    getEventType() {
      return constants.EVENT_TYPES.FORM_SUBMITTED;
    },
    getEventListFn() {
      return {
        fn: this.mautic.listFormSubmissions,
        pathVariables: {
          formId: this.formId,
        },
      };
    },
    isRelevant() {
      return true;
    },
    generateMeta(form) {
      const {
        id,
        dateSubmitted: ts,
      } = form;
      const formName = form.form.name;
      return {
        id,
        ts,
        summary: `New form submission for ${formName}`,
      };
    },
    emitEvent(event) {
      const submission = event.submission
        ? event.submission
        : event;
      const meta = this.generateMeta(submission);
      console.log(`Emitting event - ${meta.summary}`);
      this.$emit(submission, meta);
    },
  },
};
