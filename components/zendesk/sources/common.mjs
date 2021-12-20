import constants from "../constants.mjs";
import zendesk from "../zendesk.app.mjs";

export default {
  props: {
    zendesk,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    categoryId: {
      propDefinition: [
        zendesk,
        "categoryId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { categoryId } = this;
      const { oauth_access_token: oauthAccessToken } = this.zendesk.$auth;

      const { webhook } = await this.zendesk.createWebhook({
        data: this.setupWebhookData({
          endpoint: this.http.endpoint,
          token: oauthAccessToken,
        }),
      });

      const { id: webhookId } = webhook;
      this.setWebhookId(webhookId);

      const { trigger } = await this.zendesk.createTrigger({
        data: this.setupTriggerData({
          webhookId,
          categoryId,
        }),
      });

      const { id: triggerId } = trigger;
      this.setTriggerId(String(triggerId));
    },
    async deactivate() {
      await Promise.all([
        this.zendesk.deleteTrigger({
          triggerId: this.getTriggerId(),
        }),
        this.zendesk.deleteWebhook({
          webhookId: this.getWebhookId(),
        }),
      ]);
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setTriggerId(triggerId) {
      this.db.set(constants.TRIGGER_ID, triggerId);
    },
    getTriggerId() {
      return this.db.get(constants.TRIGGER_ID);
    },
    getWebhookName() {
      throw new Error("webhookName Not implemented");
    },
    getTriggerTitle() {
      throw new Error("triggerTitle Not implemented");
    },
    /**
     * If you want to use this function, you need to implement it in your component.
     * setupTriggerData depends on this function.
     * https://developer.zendesk.com/documentation/ticketing/reference-guides/conditions-reference/
     */
    getTriggerConditions() {
      throw new Error("triggerConditions Not implemented");
    },
    /**
     * If you want to use this function, you need to implement it in your component.
     * setupTriggerData depends on this function.
     * https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/
     */
    getTriggerPayload() {
      throw new Error("triggerPayload Not implemented");
    },
    setupWebhookData({
      token, endpoint,
    }) {
      return {
        webhook: {
          endpoint,
          http_method: "POST",
          name: this.getWebhookName(),
          status: "active",
          request_format: "json",
          subscriptions: [
            "conditional_ticket_events",
          ],
          authentication: {
            type: "bearer_token",
            data: {
              token,
            },
            add_position: "header",
          },
        },
      };
    },
    setupTriggerData({
      webhookId, categoryId,
    }) {
      return {
        trigger: {
          title: this.getTriggerTitle(),
          category_id: categoryId,
          conditions: this.getTriggerConditions(),
          actions: [
            {
              field: "notification_webhook",
              value: [
                webhookId,
                JSON.stringify(this.getTriggerPayload()),
              ],
            },
          ],
        },
      };
    },
  },
};
