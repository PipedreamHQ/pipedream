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
  },
  hooks: {
    async activate() {
      try {
        const {
          serviceId,
          http,
        } = this;

        const data = this.setupWebhookData({
          endpoint: http.endpoint,
          serviceId,
        });

        const { id: webhookId } = await this.pagerduty.createWebhookSubscription({
          data,
          headers: {
            Authorization: `Token token=${constants.API_KEY}`,
          },
        });
        this.setWebhookId(webhookId);

      } catch (error) {
        console.log("error", error);
      }
    },
    async deactivate() {
      await this.pagerduty.deleteWebhookSubscription({
        webhookId: this.getWebhookId(),
        headers: {
          Authorization: `Token token=${constants.API_KEY}`,
        },
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
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
    getEventTypes() {
      throw new Error("getEventTypes Not implemented");
    },
    setupWebhookData({
      endpoint, serviceId,
    }) {
      return {
        webhook_subscription: {
          type: "webhook_subscription",
          delivery_method: {
            type: "http_delivery_method",
            url: endpoint,
          },
          events: this.getEventTypes(),
          filter: {
            id: serviceId,
            type: "service_reference",
          },
        },
      };
    },
  },
  async run(event) {
    const payload = event.body.event;
    this.$emit(payload, this.getMetadata(payload));
  },
};
