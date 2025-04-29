import lokalise from "../../lokalise.app.mjs";

export default {
  props: {
    lokalise,
    http: "$.interface.http",
    db: "$.service.db",
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { webhook } = await this.lokalise.createWebhook({
        projectId: this.projectId,
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
      this._setHookId(webhook.webhook_id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.lokalise.deleteWebhook({
          projectId: this.projectId,
          hookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    generateMeta(event) {
      return {
        id: `${event.event}-${event.created_at_timestamp}`,
        summary: this.getSummary(event),
        ts: event.created_at_timestamp,
      };
    },
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (!body.event) {
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
