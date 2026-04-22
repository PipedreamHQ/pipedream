import formcan from "../../formcan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "formcan-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when a user submits a form. [See the documentation](https://api.docs.formcan.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    formcan,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        formcan,
        "formId",
      ],
    },
    formData: {
      propDefinition: [
        formcan,
        "formData",
        (c) => ({
          formId: c.formId,
        }),
      ],
      optional: true,
    },
    submissionTime: {
      propDefinition: [
        formcan,
        "submissionTime",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent form submissions and emit them as historical events
      const submissions = await this.formcan.paginate(this.formcan.submitForm, {
        formId: this.formId,
        pageSize: 50,
      });

      // Emit each submission from oldest to most recent
      submissions.reverse().forEach((submission) => {
        this.$emit(submission, {
          id: submission.id,
          summary: `New submission: ${submission.id}`,
          ts: Date.parse(submission.created_at),
        });
      });
    },
    async activate() {
      // Webhook subscriptions are typically created here, but FormCan does not
      // require creating a webhook subscription for instant triggers.
    },
    async deactivate() {
      // Webhook subscriptions are typically deleted here, but FormCan does not
      // require deleting a webhook subscription for instant triggers.
    },
  },
  async run(event) {
    const { body } = event;

    // Emit the new form submission
    this.$emit(body, {
      id: body.submissionId || `${Date.now()}`, // Use submissionId if available, else fallback to a timestamp
      summary: `New submission for form ID: ${this.formId}`,
      ts: body.submissionTime
        ? Date.parse(body.submissionTime)
        : Date.now(),
    });

    // Respond to the HTTP request
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
