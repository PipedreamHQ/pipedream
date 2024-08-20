import { axios } from "@pipedream/platform";
import activecalculator from "../../activecalculator.app.mjs";

export default {
  key: "activecalculator-new-submission-instant",
  name: "New Submission Instant",
  description: "Emit new event when there's a new submission. [See the documentation](https://activecalculator.readme.io/reference/get-all-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    activecalculator,
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      const webhooks = await this.activecalculator.getAllWebhooks();
      const allSubmissions = [];

      for (const webhook of webhooks) {
        const submissions = await this.activecalculator.getWebhook(webhook.id);
        allSubmissions.push(...submissions);
      }

      for (const submission of allSubmissions.slice(0, 50)) {
        this.$emit(submission, {
          id: submission.id,
          summary: `New Submission: ${submission.id}`,
          ts: Date.parse(submission.createdAt),
        });
      }
    },
    async activate() {
      const webhookUrl = this.$endpoint;
      await this.activecalculator.registerWebhook(webhookUrl, []);
    },
    async deactivate() {
      const webhooks = await this.activecalculator.getAllWebhooks();
      for (const webhook of webhooks) {
        await this.activecalculator.removeWebhook(webhook.id);
      }
    },
  },
  async run(event) {
    this.activecalculator.emitNewSubmissionEvent(event);
  },
};
