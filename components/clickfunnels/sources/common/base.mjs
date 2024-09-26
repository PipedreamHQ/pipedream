import clickfunnels from "../../clickfunnels.app.mjs";

export default {
  props: {
    clickfunnels,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    teamId: {
      propDefinition: [
        clickfunnels,
        "teamId",
      ],
    },
    workspaceId: {
      propDefinition: [
        clickfunnels,
        "workspaceId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Webhook Name",
      description: "The name of the webhook to identify in Clickfunnels.",
    },
  },
  methods: {
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    generateMeta(body) {
      return {
        id: body.event_id,
        summary: this.getSummary(body),
        ts: Date.parse(body.created_at),
      };
    },
  },
  hooks: {
    async activate() {
      const webhook = await this.clickfunnels.createWebhook({
        workspaceId: this.workspaceId,
        data: {
          webhooks_outgoing_endpoint: {
            url: this.http.endpoint,
            name: this.name,
            event_type_ids: this.getEventTypes(),
          },
        },
      });

      this._setHookId(webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      return await this.clickfunnels.deleteWebhook(hookId);
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.$emit(body, this.generateMeta(body));

  },
};
