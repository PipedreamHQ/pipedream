import { axios } from "@pipedream/platform";
import opnform from "../../opnform.app.mjs";

export default {
  key: "opnform-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit a new event when a form receives a submission. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    opnform: {
      type: "app",
      app: "opnform",
    },
    workspaceId: {
      propDefinition: [
        "opnform",
        "workspaceId",
      ],
    },
    formId: {
      propDefinition: [
        "opnform",
        "formId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const hookUrl = this.http.endpoint;
      const webhook = await this.opnform.createWebhook({
        hookUrl,
        formId: this.formId,
      });
      await this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.opnform._makeRequest({
          method: "DELETE",
          path: `/webhook/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
    async deploy() {
      const submissions = await this.opnform.paginate(
        this.opnform._makeRequest.bind(this.opnform),
        {
          method: "GET",
          path: `/forms/${this.formId}/submissions`,
          params: {
            limit: 50,
          },
        },
      );

      submissions.reverse().forEach((submission) => {
        this.$emit(
          submission,
          {
            id: submission.id || Date.now().toString(),
            summary: `New submission for form ${submission.formName}`,
            ts: submission.createdAt
              ? Date.parse(submission.createdAt)
              : Date.now(),
          },
        );
      });
    },
  },
  async run(event) {
    const submission = event.body;
    const id = submission.id || Date.now().toString();
    const summary = `New submission for form ${submission.formName}`;
    const ts = submission.createdAt
      ? Date.parse(submission.createdAt)
      : Date.now();
    this.$emit(submission, {
      id,
      summary,
      ts,
    });
  },
};
