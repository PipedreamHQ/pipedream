import browseAi from "../../browse_ai.app.mjs";

export default {
  key: "browse_ai-task-finished-with-error",
  name: "Task Finished With Error",
  description: "Emit new event when a task finishes with an error. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    browseAi: {
      type: "app",
      app: "browse_ai",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const webhookId = await this.browseAi.createWebhook({
        targetUrl: this.http.endpoint,
        events: [
          "taskfinishedwitherror",
        ],
      });
      this.db.set("webhookId", webhookId);
    },
    async deactivate() {
      const webhookId = this.db.get("webhookId");
      if (webhookId) {
        await this.browseAi.deleteWebhook(webhookId);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    if (headers["x-browseai-signature"] !== this.browseAi.$auth.api_token) {
      this.http.respond({
        status: 401,
        body: "Unauthorized",
      });
      return;
    }

    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: body.id,
      summary: `Task ${body.id} finished with error`,
      ts: Date.parse(body.updated_at),
    });
  },
};
