import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "connecteam-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a new form submission is created.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.connecteam,
        "formId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getModelField() {
      return "formSubmissions";
    },
    getModelFieldId() {
      return "formSubmissionId";
    },
    getModelDateField() {
      return "submissionTimestamp";
    },
    getParams(lastDate) {
      return {
        submittingStartTimestamp: lastDate,
      };
    },
    getProps() {
      return {
        formId: this.formId,
      };
    },
    getFunction() {
      return this.connecteam.listFormSubmissions;
    },
    getSummary(item) {
      return `New form submission ${item.formSubmissionId}`;
    },
  },
  sampleEmit,
};
