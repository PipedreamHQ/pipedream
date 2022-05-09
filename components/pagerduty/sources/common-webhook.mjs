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
      const {
        serviceId,
        http,
      } = this;

      const data = this.setupExtensionData({
        endpoint: http.endpoint,
        serviceId,
        outboundIntegrationId: constants.GENERIC_V2_WEBHOOK_OUTBOUND_INTEGRATION_ID,
      });

      const { extension } = await this.pagerduty.createExtension({
        data,
      });

      this.setExtensionId(extension.id);
    },
    async deactivate() {
      await this.pagerduty.deleteExtension({
        extensionId: this.getExtensionId(),
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
    setExtensionId(extensionId) {
      this.db.set(constants.EXTENSION_ID, extensionId);
    },
    getExtensionId() {
      return this.db.get(constants.EXTENSION_ID);
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
    getEventTypes() {
      throw new Error("getEventTypes Not implemented");
    },
    getExtensionName() {
      throw new Error("getExtensionName Not implemented");
    },
    /**
     * https://support.pagerduty.com/docs/webhooks
     * In this function we setup the data that will be used to create
     * the webhook version v3.
     */
    setupWebhookData({
      endpoint, serviceId,
    }) {
      return {
        webhook_subscription: {
          type: constants.WEBHOOK_TYPE,
          delivery_method: {
            type: constants.HTTP_DELIVERY_METHOD_TYPE,
            url: endpoint,
          },
          events: this.getEventTypes(),
          filter: {
            id: serviceId,
            type: constants.REFERENCE.SERVICE,
          },
        },
      };
    },
    /**
     * In this function we setup the extension data that will be used to create the extension
     * for the webhook version v2.
     */
    setupExtensionData({
      endpoint, outboundIntegrationId, serviceId,
    }) {
      return {
        extension: {
          name: this.getExtensionName(),
          endpoint_url: endpoint,
          extension_schema: {
            id: outboundIntegrationId,
            type: constants.REFERENCE.EXTENSION_SCHEMA,
          },
          extension_objects: [
            {
              id: serviceId,
              type: constants.REFERENCE.SERVICE,
            },
          ],
        },
      };
    },
  },
  async run(event) {
    const { messages } = event.body;
    const [
      {
        id,
        event: messageEvent,
        incident,
      },
    ] = messages;

    const payload = {
      id,
      event: messageEvent,
      incident,
    };

    this.$emit(payload, this.getMetadata(payload));
  },
};
