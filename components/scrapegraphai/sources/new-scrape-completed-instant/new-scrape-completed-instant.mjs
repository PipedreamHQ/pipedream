import scrapegraphai from "../../scrapegraphai.app.mjs";
import { axios } from "@pipedream/platform";
import crypto from "crypto";

export default {
  key: "scrapegraphai-new-scrape-completed-instant",
  name: "New Scrape Completed - Instant",
  description: "Emit a new event when a web scraping task is completed. [See the documentation](",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    scrapegraphai: {
      type: "app",
      app: "scrapegraphai",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    taskId: {
      propDefinition: [
        scrapegraphai,
        "taskId",
      ],
      optional: true,
    },
    scrapingJobFilter: {
      propDefinition: [
        scrapegraphai,
        "scrapingJobFilter",
      ],
      optional: true,
    },
    dataTypeFilter: {
      propDefinition: [
        scrapegraphai,
        "dataTypeFilter",
      ],
      optional: true,
    },
    scrapingTaskNameFilter: {
      propDefinition: [
        scrapegraphai,
        "scrapingTaskNameFilter",
      ],
      optional: true,
    },
    errorTypeFilter: {
      propDefinition: [
        scrapegraphai,
        "errorTypeFilter",
      ],
      optional: true,
    },
  },
  methods: {
    async _getWebhookId() {
      return this.db.get("webhookId");
    },
    async _setWebhookId(id) {
      await this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      const events = await this.scrapegraphai.paginate(this.scrapegraphai.onTaskCompleted, {
        taskId: this.taskId,
        scrapingJobFilter: this.scrapingJobFilter,
        dataTypeFilter: this.dataTypeFilter,
        scrapingTaskNameFilter: this.scrapingTaskNameFilter,
        errorTypeFilter: this.errorTypeFilter,
      });
      const eventsToEmit = events.slice(-50).reverse();
      for (const event of eventsToEmit) {
        const id = event.id || `${Date.now()}`;
        const summary = event.summary || `Task ${event.taskId} completed`;
        const ts = event.completedAt
          ? Date.parse(event.completedAt)
          : Date.now();
        this.$emit(event, {
          id,
          summary,
          ts,
        });
      }
    },
    async activate() {
      const response = await this.scrapegraphai._makeRequest({
        method: "POST",
        path: "/webhooks",
        data: {
          callback_url: this.http.endpoint,
          event: "task_completed",
          ...(this.taskId
            ? {
              task_id: this.taskId,
            }
            : {}),
          ...(this.scrapingJobFilter
            ? {
              scraping_job_filter: this.scrapingJobFilter,
            }
            : {}),
          ...(this.dataTypeFilter
            ? {
              data_type_filter: this.dataTypeFilter,
            }
            : {}),
          ...(this.scrapingTaskNameFilter
            ? {
              scraping_task_name_filter: this.scrapingTaskNameFilter,
            }
            : {}),
          ...(this.errorTypeFilter
            ? {
              error_type_filter: this.errorTypeFilter,
            }
            : {}),
        },
      });
      await this._setWebhookId(response.id);
    },
    async deactivate() {
      const webhookId = await this._getWebhookId();
      if (webhookId) {
        await this.scrapegraphai._makeRequest({
          method: "DELETE",
          path: `/webhooks/${webhookId}`,
        });
        await this.db.delete("webhookId");
      }
    },
  },
  async run(event) {
    const signature = event.headers["x-scrapegraphai-signature"];
    const payload = JSON.stringify(event.body);
    const secret = this.scrapegraphai.$auth.webhook_secret;

    const computedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (computedSignature !== signature) {
      await this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    const data = event.body;

    if (this.taskId && data.taskId !== this.taskId) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified Task ID.",
      });
      return;
    }

    if (this.scrapingJobFilter && data.scrapingJob !== this.scrapingJobFilter) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified Scraping Job Filter.",
      });
      return;
    }

    if (this.dataTypeFilter && data.dataType !== this.dataTypeFilter) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified Data Type Filter.",
      });
      return;
    }

    if (this.scrapingTaskNameFilter && data.scrapingTaskName !== this.scrapingTaskNameFilter) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified Scraping Task Name Filter.",
      });
      return;
    }

    if (this.errorTypeFilter && data.errorType !== this.errorTypeFilter) {
      await this.http.respond({
        status: 200,
        body: "Event does not match the specified Error Type Filter.",
      });
      return;
    }

    const id = data.id || `${Date.now()}`;
    const summary = data.summary || `Task ${data.taskId} completed`;
    const ts = data.completedAt
      ? Date.parse(data.completedAt)
      : Date.now();

    this.$emit(data, {
      id,
      summary,
      ts,
    });

    await this.http.respond({
      status: 200,
      body: "Event received and processed.",
    });
  },
};
