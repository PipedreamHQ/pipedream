import { axios } from "@pipedream/platform";
import connecteam from "../../connecteam.app.mjs";

export default {
  key: "connecteam-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a new form submission is created. [See the documentation](https://developer.connecteam.com/reference/get_form_submissions_forms_v1_forms__formid__form_submissions_get)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    connecteam,
    db: "$.service.db",
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to monitor for new submissions",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getLastSubmissionTimestamp() {
      return this.db.get("lastSubmissionTimestamp") || 0;
    },
    _setLastSubmissionTimestamp(timestamp) {
      this.db.set("lastSubmissionTimestamp", timestamp);
    },
    async _getFormSubmissions(formId, timestamp) {
      return this.connecteam._makeRequest({
        path: `/forms/v1/forms/${formId}/form-submissions`,
        params: {
          submissionTimestamp: timestamp,
        },
      });
    },
  },
  hooks: {
    async deploy() {
      const formId = this.formId;
      const timestamp = this._getLastSubmissionTimestamp();
      const submissions = await this._getFormSubmissions(formId, timestamp);

      for (const submission of submissions) {
        this.$emit(submission, {
          id: submission.formSubmissionId,
          summary: `New form submission ${submission.formSubmissionId}`,
          ts: submission.submissionTimestamp,
        });
      }

      if (submissions.length > 0) {
        const lastSubmission = submissions[submissions.length - 1];
        this._setLastSubmissionTimestamp(lastSubmission.submissionTimestamp);
      }
    },
    async activate() {
      await this.deploy();
    },
    async deactivate() {
      // Implement any cleanup logic if necessary
    },
  },
  async run() {
    const formId = this.formId;
    const timestamp = this._getLastSubmissionTimestamp();
    const submissions = await this._getFormSubmissions(formId, timestamp);

    for (const submission of submissions) {
      this.$emit(submission, {
        id: submission.formSubmissionId,
        summary: `New form submission ${submission.formSubmissionId}`,
        ts: submission.submissionTimestamp,
      });
    }

    if (submissions.length > 0) {
      const lastSubmission = submissions[submissions.length - 1];
      this._setLastSubmissionTimestamp(lastSubmission.submissionTimestamp);
    }
  },
};
