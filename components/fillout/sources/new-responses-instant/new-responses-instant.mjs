import { axios } from "@pipedream/platform";
import fillout from "../../fillout.app.mjs";

export default {
  key: "fillout-new-responses-instant",
  name: "New Form Response",
  description: "Emit new event each time a Fillout form is submitted. [See the documentation](https://www.fillout.com/help/fillout-rest-api)",
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
        sort: "desc",
      });

      for (const submission of submissions.responses) {
        this.$emit(submission, {
          id: submission.submissionId,
          summary: `New response for form ${this.formId}`,
          ts: new Date(submission.submissionTime).getTime(),
        });
      }
    },
    async activate() {
      await this.fillout.createWebhook({
        formId: this.formId,
        url: this.$endpoint,
      });
    },
    async deactivate() {
      const webhooks = await this.fillout.getFormWebhooks({
        formId: this.formId,
      });
      for (const webhook of webhooks) {
        if (webhook.url === this.$endpoint) {
          await this.fillout.deleteWebhook({
            webhookId: webhook.id,
          });
        }
      }
    },
  },
  async run(event) {
    const submission = event.body;
    this.$emit(submission, {
      id: submission.submissionId,
      summary: `New response for form ${this.formId}`,
      ts: new Date(submission.submissionTime).getTime(),
    });
  },
};
