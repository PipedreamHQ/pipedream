import common from "./base.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: "$.interface.http",
  },
  hooks: {
    ...common.hooks,
    async activate() {
      const data = {
        types: this.getWebhookTypes(),
        payload_url: this.http.endpoint,
      };
      const { id } = await this.app.createWebhook({
        accountId: this.accountId,
        projectId: this.projectId,
        data,
      });
      this._setWebhookId(id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.app.deleteWebhook({
        accountId: this.accountId,
        projectId: this.projectId,
        webhookId,
      });
    },
  },
  methods: {
    ...common.methods,
    filterEvent(event) {
      const allowedEvents = this.getAllowedEvents();
      if (allowedEvents.includes(event.kind)) {
        return event;
      }
    },
    getAllowedEvents() {
      throw new Error("getAllowedEvents is not implemented");
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
  },
  async run(request) {
    const data = await this.filterEvent(request.body);
    if (data) {
      this.emitEvent(data);
    }
  },
};
