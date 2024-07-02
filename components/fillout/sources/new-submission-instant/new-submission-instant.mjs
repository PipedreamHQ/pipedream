import fillout from "../../fillout.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fillout-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when a form receives a new submission. [See the documentation](https://www.fillout.com/help/fillout-rest-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    fillout,
    db: "$.service.db",
    formId: {
      propDefinition: [
        fillout,
        "formId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const submissions = await this.fillout.getFormSubmissions({
        formId: this.formId,
        limit: 50,
      });

      submissions.responses.slice(0, 50).forEach((submission) => {
        this.$emit(submission, {
          id: submission.submissionId,
          summary: `New submission from form ${this.formId}`,
          ts: new Date(submission.submissionTime).getTime(),
        });
      });
    },
    async activate() {
      const webhookUrl = this.http.endpoint;
      const response = await this.fillout.createWebhook({
        formId: this.formId,
        url: webhookUrl,
      });
      await this.db.set("webhookId", response.webhookId);
    },
    async deactivate() {
      const webhookId = await this.db.get("webhookId");
      if (webhookId) {
        await this.fillout.deleteWebhook({
          webhookId,
        });
      }
    },
  },
  async run() {
    const { body } = this.http;
    this.$emit(body, {
      id: body.submissionId,
      summary: `New submission from form ${this.formId}`,
      ts: new Date(body.submissionTime).getTime(),
    });
  },
};
