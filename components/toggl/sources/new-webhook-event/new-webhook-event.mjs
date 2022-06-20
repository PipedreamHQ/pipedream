import toggl from "../../toggl.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "New Webhook Event (Instant)",
  version: "0.0.1",
  key: "toggl-new-response",
  description: "Emit new event on receive a webhook event. [See docs here](https://github.com/toggl/toggl_api_docs/blob/master/webhooks.md)",
  type: "source",
  dedupe: "unique",
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    entity: {
      label: "Entity",
      description: "The entity you want to listen the events",
      type: "string",
      options: constants.WEBHOOK_ENTITIES,
    },
    action: {
      label: "Action",
      description: "The action you want to listen the events",
      type: "string",
      options: constants.WEBHOOK_ACTIONS,
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(webhookId) {
      this.db.set("webhookId", webhookId);
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
              entity: this.entity,
              action: this.action,
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

    if (body.payload === "ping") {
      return await this.http.respond({
        status: 200,
        body: {
          validation_code: body.validation_code,
        },
      });
    }

    this.$emit(body, {
      id: body.event_id,
      summary: `New ${this.entity} ${this.action} with id ${body.payload.id}`,
      ts: Date.parse(body.created_at),
    });
  },
};
