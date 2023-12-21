import nifty from "../../nifty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nifty-task-created",
  name: "Task Created",
  description: "Emit new event when a task is created in a project. [See the documentation](https://openapi.niftypm.com/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    nifty: {
      type: "app",
      app: "nifty_pm",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    projectId: {
      propDefinition: [
        nifty,
        "projectId",
      ],
    },
    webhookUrl: {
      propDefinition: [
        nifty,
        "webhookUrl",
        (c) => ({
          webhookUrl: c.http.endpoint,
        }),
      ],
    },
    eventType: {
      propDefinition: [
        nifty,
        "eventType",
        () => ({
          eventType: "task.created",
        }),
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit up to 50 most recent tasks created
      const tasks = await this.nifty.getTasks({
        projectId: this.projectId,
      });
      tasks.slice(-50).forEach((task) => {
        this.$emit(task, {
          id: task.id,
          summary: `New task created: ${task.name}`,
          ts: Date.parse(task.created_at),
        });
      });
    },
    async activate() {
      const { data } = await this.nifty.createWebhook({
        projectId: this.projectId,
        webhookUrl: this.webhookUrl,
        eventType: this.eventType,
      });
      this._setWebhookId(data.id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      if (webhookId) {
        await this.nifty.deleteWebhook({
          webhookId,
        });
        this._setWebhookId(null);
      }
    },
  },
  async run(event) {
    const {
      body, headers,
    } = event;

    // Optionally, validate the webhook signature here

    if (body && body.event === "task.created") {
      this.$emit(body, {
        id: body.data.id,
        summary: `New task created: ${body.data.name}`,
        ts: Date.parse(body.data.created_at),
      });
    } else {
      this.http.respond({
        status: 404,
        body: "Event type mismatch or missing body",
      });
    }
  },
};
