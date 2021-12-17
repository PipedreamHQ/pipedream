import constants from "../../constants.mjs";
import zendesk from "../../zendesk.app.mjs";

export default {
  name: "New Ticket",
  key: "zendesk-new-issue",
  type: "source",
  description: "Emit new event when a ticket is created",
  version: "0.0.1",
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
    async deploy() {
      const { categoryId } = this;
      const { oauth_access_token: oauthAccessToken } = this.zendesk.$auth;

      const webhookData = this.setupWebhookData({
        endpoint: this.http.endpoint,
        token: oauthAccessToken,
      });

      const { webhook } = await this.zendesk.createWebhook({
        data: webhookData,
      });

      console.log("webhook", webhook);
      const { id: webhookId } = webhook;

      this.setWebhookId(webhookId);

      const triggerData = this.setupTriggerData({
        webhookId,
        categoryId,
      });

      const { trigger } = await this.zendesk.createTrigger({
        data: triggerData,
      });

      console.log("trigger", trigger);
      const { id: triggerId } = trigger;

      this.setTriggerId(triggerId);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      const triggerId = this.getTriggerId();

      const responseTrigger = await this.zendesk.deleteTrigger({
        triggerId,
      });

      console.log("responseTrigger", responseTrigger);

      const responseWebhook = await this.zendesk.deleteWebhook({
        webhookId,
      });

      console.log("responseWebhook", responseWebhook);
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      this.db.get(constants.WEBHOOK_ID);
    },
    setTriggerId(triggerId) {
      this.db.set(constants.TRIGGER_ID, triggerId);
    },
    getTriggerId() {
      this.db.get(constants.TRIGGER_ID);
    },
    setupWebhookData({
      token, endpoint,
    }) {
      return {
        webhook: {
          endpoint,
          http_method: "POST",
          name: "New Ticket Webhook",
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
      const payload = {
        ticketId: "{{ticket.id}}",
        title: "{{ticket.title}}",
        description: "{{ticket.description}}",
        url: "{{ticket.url}}",
        requester: "{{ticket.requester.first_name}} {{ticket.requester.last_name}} <{{ticket.requester.email}}>",
        assignee: "{{ticket.assignee.first_name}} {{ticket.assignee.last_name}} <{{ticket.assignee.email}}>",
        status: "{{ticket.status}}",
        dueDate: "{{ticket.due_date}}",
      };

      return {
        title: "Webhook notification when a new ticket is created",
        trigger: {
          category_id: categoryId,
          conditions: {
            all: [
              {
                field: "status",
                operator: "is",
                value: "new",
              },
            ],
          },
          actions: [
            {
              field: "notification_webhook",
              value: [
                webhookId,
                JSON.stringify(payload),
              ],
            },
          ],
        },
      };
    },
  },
  async run(event) {
    const payload = event.body;

    this.$emit(payload, {
      id: payload.id,
      summary: JSON.stringify(payload),
      ts: Date.parse(payload.updated_at),
    });
  },
};
