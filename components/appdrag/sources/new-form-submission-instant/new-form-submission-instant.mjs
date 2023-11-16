import { axios } from "@pipedream/platform";
import appdrag from "../../appdrag.app.mjs";

export default {
  key: "appdrag-new-form-submission-instant",
  name: "New Form Submission (Instant)",
  description: "Emit new event when a form is submitted. [See the documentation](https://support.appdrag.com/doc/Api-CloudBackend)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    appdrag,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    formId: {
      propDefinition: [
        appdrag,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit the 50 most recent form submissions
      const forms = await this.appdrag.listForms();
      const form = forms.find((form) => form.id === this.formId);
      const submissions = form.submissions.slice(-50).reverse(); // Assuming the submissions are stored in a submissions property
      for (const submission of submissions) {
        this.$emit(submission, {
          id: submission.id,
          summary: `New submission: ${submission.id}`,
          ts: Date.parse(submission.created_at),
        });
      }
    },
    async activate() {
      // Create a webhook subscription if the API supports it
      const webhookId = await this.appdrag.createWebhook({
        formId: this.formId,
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      // Delete the webhook subscription if the API supports it
      const webhookId = this.db.get("webhookId");
      await this.appdrag.deleteWebhook({
        webhookId,
      });
      this.db.set("webhookId", null);
    },
  },
  async run(event) {
    // Validate the incoming webhook signature if applicable
    const signatureIsValid = this.appdrag.validateWebhookSignature(event);
    if (!signatureIsValid) {
      this.http.respond({
        status: 401,
        body: "Invalid signature",
      });
      return;
    }

    // Emit the new form submission event
    const submission = event.body; // Assuming the submission data is in the event body
    this.$emit(submission, {
      id: submission.id,
      summary: `New submission: ${submission.id}`,
      ts: Date.parse(submission.created_at),
    });

    // Respond to the webhook
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
