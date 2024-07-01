import { axios } from "@pipedream/platform";
import dropboard from "../../dropboard.app.mjs";

export default {
  key: "dropboard-new-job-instant",
  name: "New Job Created",
  description: "Emit new event when a new job is created. [See the documentation](https://dropboard.readme.io/reference/webhooks-jobs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dropboard,
    db: "$.service.db",
    jobDetails: {
      propDefinition: [
        dropboard,
        "jobDetails",
      ],
    },
    clientId: {
      propDefinition: [
        dropboard,
        "clientId",
      ],
    },
    jobId: {
      propDefinition: [
        dropboard,
        "jobId",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch historical data and emit up to 50 events
      const jobs = await this.dropboard._makeRequest({
        method: "GET",
        path: "/jobs",
        params: {
          clientId: this.clientId,
        },
      });

      for (const job of jobs.slice(0, 50)) {
        this.$emit(job, {
          id: job.id,
          summary: `New Job: ${job.title}`,
          ts: new Date(job.createdAt).getTime(),
        });
      }
    },
    async activate() {
      const webhook = await this.dropboard.createJobWebhook({
        data: {
          url: this.http.endpoint,
          clientId: this.clientId,
        },
      });
      this.db.set("webhookId", webhook.id);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.dropboard._makeRequest({
          method: "DELETE",
          path: `/jobs/webhooks/${webhookId}`,
        });
      }
    },
  },
  async run(event) {
    const job = event.body;
    this.$emit(job, {
      id: job.id,
      summary: `New Job: ${job.title}`,
      ts: new Date(job.createdAt).getTime(),
    });
  },
};
