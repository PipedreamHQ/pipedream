import { WebflowClient } from "webflow-api";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "webflow",
  propDefinitions: {
    domains: {
      label: "Custom Domains",
      description: "Select one or more custom domains to publish.",
      type: "string[]",
      async options({ siteId }) {
        const domains = await this.listDomains(siteId);
        return domains.map((id, url) => ({
          label: url,
          id,
        }));
      },
    },
    sites: {
      label: "Site",
      description: "Select a site or provide a custom site ID.",
      type: "string",
      async options() {
        const sites = await this.listSites();

        return sites.map((site) => ({
          label: site.displayName || site.shortName,
          value: site.id,
        }));
      },
    },
    collections: {
      label: "Collection",
      description: "Select a collection or provide a custom collection ID.",
      type: "string",
      async options({ siteId }) {
        const collections = await this.listCollections(siteId);

        return collections.map((collection) => ({
          label: collection.displayName || collection.slug,
          value: collection.id,
        }));
      },
    },
    items: {
      label: "Item",
      description: "Select an item or provide a custom item ID.",
      type: "string",
      async options({
        collectionId, page,
      }) {
        const items = await this.listCollectionItems(page, collectionId);

        return items.map((item) => ({
          label: item.fieldData?.name || item.fieldData?.slug,
          value: item.id,
        }));
      },
    },
    orders: {
      label: "Order",
      description: "Select an order, or provide a custom order ID.",
      type: "string",
      async options({
        siteId, page,
      }) {
        const items = await this.listOrders({
          page,
          siteId,
        });

        return items.map((item) => item.orderId);
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    webflowClient() {
      return new WebflowClient({
        accessToken: this._authToken(),
      });
    },
    async createWebhook(siteId, data) {
      return this.webflowClient().webhooks.create(siteId, data);
    },
    async removeWebhook(webhookId) {
      return this.webflowClient().webhooks.delete(webhookId);
    },
    async getOrder(siteId, orderId) {
      return this.webflowClient().orders.get(siteId, orderId);
    },
    async listOrders({
      page: offset = 0, siteId, status,
    }) {
      const response = await this.webflowClient().orders.list(siteId, {
        offset,
        status,
      });
      return response?.orders;
    },
    async listDomains(siteId) {
      const response = await this.webflowClient().sites.getCustomDomain(siteId);
      return response?.customDomains;
    },
    getSite(siteId) {
      return this.webflowClient().sites.get(siteId);
    },
    async listSites() {
      const response = await this.webflowClient().sites.list();
      return response?.sites;
    },
    getCollection(collectionId) {
      return this.webflowClient().collections.get(collectionId);
    },
    async listCollections(siteId) {
      if (!siteId) return [];

      const response = await this.webflowClient().collections.list(siteId);
      return response?.collections;
    },
    async listCollectionItems(page = 0, collectionId) {
      if (!collectionId) return [];

      const response = await this.webflowClient().collections.items.listItems(collectionId, {
        limit: constants.LIMIT,
        offset: page,
      });

      return response?.items;
    },
    getCollectionItem(collectionId, itemId) {
      return this.webflowClient().collections.items.getItem(collectionId, itemId);
    },
    deleteCollectionItem(collectionId, itemId) {
      return this.webflowClient().collections.items.deleteItem(collectionId, itemId);
    },
    createCollectionItem(collectionId, data) {
      return this.webflowClient().collections.items.createItem(collectionId, data);
    },
    updateCollectionItem(collectionId, itemId, data) {
      return this.webflowClient().collections.items.updateItem(collectionId, itemId, data);
    },
    getCollectionItemInventory(collectionId, itemId) {
      return this.webflowClient().inventory.list(collectionId, itemId);
    },
    updateCollectionItemInventory(collectionId, itemId, data) {
      return this.webflowClient().inventory.update(collectionId, itemId, data);
    },
    publishSite(siteId, customDomains) {
      return this.webflowClient().sites.publish(siteId, {
        customDomains,
      });
    },
    fulfillOrder(siteId, orderId, data) {
      return this.webflowClient().orders.updateFulfill(siteId, orderId, data);
    },
    unfulfillOrder(siteId, orderId) {
      return this.webflowClient().orders.updateUnfulfill(siteId, orderId);
    },
    refundOrder(siteId, orderId) {
      return this.webflowClient().orders.refund(siteId, orderId);
    },
    updateOrder(siteId, orderId, data) {
      return this.webflowClient().orders.update(siteId, orderId, data);
    },
  },
};
