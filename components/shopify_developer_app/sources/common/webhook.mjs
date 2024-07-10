import app from "../../shopify_developer_app.app.mjs";
import constants from "./constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    metafieldNamespaces: {
      type: "string[]",
      label: "Metafield Namespaces",
      description: "Array of namespaces for any metafields that should be included with each webhook. Metafield definitions can be found in your store's Settings -> Custom Data. Select a metafield to view its namespace under \"Namespace and key\". For example, if the value is `custom.test_metafield`, the namespace is `custom`.",
      optional: true,
    },
    privateMetafieldNamespaces: {
      type: "string[]",
      label: "Private Metafield Namespaces",
      description: "Array of namespaces for any private metafields that should be included with each webhook. Metafield definitions can be found in your store's Settings -> Custom Data. Select a metafield to view its namespace under \"Namespace and key\". For example, if the value is `custom.test_metafield`, the namespace is `custom`.",
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { result: webhook } = await this.app.createWebhook({
        address: this.http.endpoint,
        topic: this.getTopic(),
        metafield_namespaces: this.metafieldNamespaces,
        private_metafield_namespaces: this.privateMetafieldNamespaces,
      });
      this.setWebhookId(webhook.id);
    },
    async deactivate() {
      const webhookId = this.getWebhookId();
      await this.app.deleteWebhook(webhookId);
    },
  },
  methods: {
    getWebhookId() {
      return this.db.get(constants.WEBHOOK_ID);
    },
    setWebhookId(webhookId) {
      this.db.set(constants.WEBHOOK_ID, webhookId);
    },
    getTopic() {
      throw new Error("getTopic is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    isWebhookEventValid({
      domain, topic,
    } = {}) {
      const [
        shopId,
      ] = domain.split(constants.DOMAIN_SUFFIX);
      return this.app.getShopId() === shopId
        && this.getTopic() === topic;
    },
    isRelevant() {
      return true;
    },
  },
  async run(event) {
    const {
      headers, body: resource,
    } = event;
    const {
      [constants.HEADER.SHOP_DOMAIN]: domain,
      [constants.HEADER.TOPIC]: topic,
    } = headers;

    const isValid = this.isWebhookEventValid({
      domain,
      topic,
    });

    if (!isValid) {
      this.http.respond({
        status: 401,
      });
      console.log(`Ignoring webhook event with domain: ${domain} and topic: ${topic}`);
      return;
    }

    this.http.respond({
      status: 200,
    });

    if (this.isRelevant(resource)) {
      this.$emit(resource, this.generateMeta(resource));
    }
  },
};
