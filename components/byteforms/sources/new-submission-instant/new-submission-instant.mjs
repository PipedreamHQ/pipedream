import byteforms from "../../byteforms.app.mjs";

export default {
  key: "byteforms-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when a user submission to a form occurs",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    byteforms: {
      type: "app",
      app: "byteforms",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        byteforms,
        "formId",
      ],
    },
    submissionDataFields: {
      propDefinition: [
        byteforms,
        "submissionDataFields",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const webhookUrl = this.http.endpoint;
      const { id } = await this.byteforms.createWebhook(this.formId, webhookUrl);
      this.db.set("webhookId", id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      await this.byteforms.deleteWebhook(this.formId, webhookId);
      this.db.set("webhookId", null);
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;
    if (headers["X-Byteforms-Signature"] !== this.byteforms.generateSignature(body)) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }
    this.$emit(body, {
      id: body.id,
      summary: `New submission for form ${this.formId}`,
      ts: Date.now(),
    });
  },
};
