import { WebflowClient } from "webflow-api";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "webflow_v2",
  propDefinitions: {
    domains: {
      label: "Domain",
      description: "The list of domains.",
      type: "string[]",
      async options({ siteId }) {
        const domains = await this.getDomains(siteId);

        return domains.map((domain) => domain.name);
      },
    },
    sites: {
      label: "Site",
      description: "The list of sites",
      type: "string",
      async options() {
        const sites = await this.getSites();

        return sites.map((site) => ({
          label: site.displayName || site.shortName,
          value: site.id,
        }));
      },
    },
    collections: {
      label: "Collection",
      description: "The list of collection of a site",
      type: "string",
      async options({ siteId }) {
        const collections = await this.getCollections(siteId);

        return collections.map((collection) => ({
          label: collection.displayName || collection.slug,
          value: collection.id,
        }));
      },
    },
    items: {
      label: "Item",
      description: "The list of items of a collection",
      type: "string",
      async options({
        collectionId, page,
      }) {
        const items = await this.getItems(page, collectionId);

        return items.map((item) => ({
          label: item.fieldData?.name || item.fieldData?.slug,
          value: item.id,
        }));
      },
    },
    orders: {
      label: "Order",
      description: "The list of orders of a site",
      type: "string",
      async options({
        siteId, page,
      }) {
        const items = await this.getOrders({
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
    async createWebhook(siteId, url, triggerType, filter = {}) {
      const apiClient = this._createApiClient();

      return apiClient.createWebhook({
        siteId,
        triggerType,
        url,
        filter,
      });
    },
    async removeWebhook(siteId, webhookId) {
      const apiClient = this._createApiClient();
      return apiClient.removeWebhook({
        siteId,
        webhookId,
      });
    },
    async getOrder({
      siteId, orderId,
    }) {
      const apiClient = this._createApiClient();

      return apiClient.get(`/sites/${siteId}/order/${orderId}`);
    },
    async listOrders({
      page, siteId, status,
    }) {
      const apiClient = this._createApiClient();

      return apiClient.get(`/sites/${siteId}/orders`, {
        status: status,
        offset: page ?? 0,
        limit: constants.LIMIT,
      });
    },
    async listDomains(siteId) {
     const response = await this.webflowClient().sites.getCustomDomain(siteId);
     return response?.customDomains;
    },
    async getSite(siteId) {
      return this.webflowClient().sites.get(siteId);
    },
    async listSites() {
      const response = await this.webflowClient().sites.list();
      return response?.sites;
    },
    async getCollection(collectionId) {
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
    async getCollectionItem(collectionId, itemId) {
      return this.webflowClient().collections.items.getItem(collectionId, itemId);
    }
  },
};
