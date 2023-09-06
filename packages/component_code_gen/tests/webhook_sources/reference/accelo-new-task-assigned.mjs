export default {
  key: "accelo-new-task-assigned",
  name: "New Task Assigned (Instant)",
  description: "Emit new event on each new task assigned.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    accelo: {
      type: "app",
      app: "accelo",
    },
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      const { response: tasks } = await this.accelo.getTasks({
        params: {
          _filters: "order_by_desc(date_created)",
          _limit: 10,
        },
      });

      for (const task of tasks.slice(0, 10).reverse()) {
        await this.emitEvent(task);
      }
    },
    async activate() {
      const { response } = await this.accelo.createWebhook({
        data: {
          trigger_url: this.http.endpoint,
          event_id: this.getWebhookEventType(),
        },
      });

      this._setWebhookId(response.subscription.subscription_id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.accelo.removeWebhook(webhookId);
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    getWebhookEventType() {
      return "assign_task";
    },
    async emitEvent(data) {
      const task = await this.accelo.getTask({
        taskId: data.id,
      });

      this.$emit(task, {
        id: data.id,
        summary: `New task assigned with ID ${data.id}`,
        ts: Date.parse(data.date_created),
      });
    },
  },
  async run(event) {
    await this.emitEvent(event.body);
  },
};
