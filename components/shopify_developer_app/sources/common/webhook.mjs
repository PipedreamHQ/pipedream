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
    checkMetaFields({
      metafields = [], private_metafields: privateMetafields = [],
    } = {}) {
      let validateMetafield = true;
      let validatePrivateMetafield = true;
      if (this.metafieldNamespaces?.length) {
        validateMetafield = false;
        for (const metafieldNamespace of this.metafieldNamespaces) {
          for (const metafieldObj of metafields) {
            if (metafieldObj.namespace === metafieldNamespace) {
              validateMetafield = true;
              break;
            }
          }
          if (validateMetafield) break;
        }
      }

      if (this.privateMetafieldNamespaces?.length) {
        validatePrivateMetafield = false;
        for (const privateMetafieldNamespace of this.privateMetafieldNamespaces) {
          for (const privateMetafieldObj of privateMetafields) {
            if (privateMetafieldObj.namespace === privateMetafieldNamespace) {
              validatePrivateMetafield = true;
              break;
            }
          }
          if (validatePrivateMetafield) break;
        }
      }

      return validateMetafield && validatePrivateMetafield;
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

    if (this.isRelevant(resource) && this.checkMetaFields(resource)) {
      this.$emit(resource, this.generateMeta(resource));
    }
  },
};
