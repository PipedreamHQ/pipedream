import constants from "../common/constants.mjs";
import pagerduty from "../pagerduty.app.mjs";

export default {
  props: {
    pagerduty,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    serviceId: {
      propDefinition: [
        pagerduty,
        "serviceId",
      ],
    },
    webhookEvent: {
      propDefinition: [
        pagerduty,
        "webhookEvent",
      ],
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const {
        serviceId,
        webhookEvent,
        http,
      } = this;

      const eventList = webhookEvent?.length
        ? webhookEvent
        : this.getEventTypes();

      const data = this.setupWebhookData({
        endpoint: http.endpoint,
        serviceId,
        eventList,
      });

      const { webhook_subscription } = await this.pagerduty.createWebhookSubscription({
        data,
      });

      this.setHookId(webhook_subscription.id);
    },
    async deactivate() {
      await this.pagerduty.deleteWebhookSubscription({
        webhookId: this.getHookId(),
      });
    },
  },
  methods: {
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setHookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getHookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
    getEventTypes() {
      throw new Error("getEventTypes Not implemented");
    },
    getHookName() {
      throw new Error("getHookName Not implemented");
    },
    setupWebhookData({
      endpoint, serviceId, eventList,
    }) {
      return {
        webhook_subscription: {
          type: constants.WEBHOOK_TYPE,
          delivery_method: {
            type: constants.HTTP_DELIVERY_METHOD_TYPE,
            url: endpoint,
          },
          description: this.getHookName(),
          events: eventList,
          filter: {
            id: serviceId,
            type: constants.REFERENCE.SERVICE,
          },
        },
      };
    },
  },
  async run({ body }) {
    const { event } = body;

    this.$emit(event, this.getMetadata(event));
  },
};
