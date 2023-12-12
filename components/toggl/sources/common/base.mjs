import toggl from "../../toggl.app.mjs";

export default {
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    async _respond(event) {
      const { body } = event;

      await this.http.respond({
        status: 200,
        body: {
          validation_code: body.validation_code,
        },
      });
    },
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
    },
    _getAction() {
      throw new Error("_getAction not implemented");
    },
    _getEntity() {
      throw new Error("_getEntity not implemented");
    },
  },
  hooks: {
    async activate() {
      const response = await this.toggl.createWebhook({
        workspaceId: this.workspaceId,
        data: {
          url_callback: this.http.endpoint,
          event_filters: [
            {
              entity: this._getEntity(),
              action: this._getAction(),
            },
          ],
        },
      });

      this._setWebhookId(response.subscription_id);
    },
    async deactivate() {
      const webhookId = this._getWebhookId();
      await this.toggl.removeWebhook({
        workspaceId: this.workspaceId,
        webhookId,
      });
    },
  },
  async run(event) {
    const { body } = event;

    await this._respond(event);
    if (body.payload === "ping") return;

    this.$emit(body, {
      id: body.event_id,
      summary: `New ${body.metadata.model} ${body.metadata.action} with id ${body.payload.id}`,
      ts: Date.parse(body.created_at),
    });
  },
};
