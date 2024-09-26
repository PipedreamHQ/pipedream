import pivotalTracker from "../../pivotal_tracker.app.mjs";

export default {
  props: {
    pivotalTracker,
    http: "$.interface.http",
    db: "$.service.db",
    projectId: {
      propDefinition: [
        pivotalTracker,
        "projectId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.pivotalTracker.createWebhook(this.projectId, {
        params: {
          webhook_url: this.http.endpoint,
          enabled: true,
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId();
      await this.pivotalTracker.deleteWebhook(this.projectId, id);
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
};
