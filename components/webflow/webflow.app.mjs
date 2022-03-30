import Webflow from "webflow-api";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "webflow",
  propDefinitions: {
    domains: {
      label: "Domain",
      description: "The list of domains.",
      type: "string[]",
      async options({ siteId }) {
        const domains = await this.getDomains(siteId);

        return domains.map((domain) => ({
          label: domain.name,
          value: domain._id,
        }));
      },
    },
    sites: {
      label: "Site",
      description: "The list of sites",
      type: "string",
      async options() {
        const sites = await this.getSites();

        return sites.map((site) => ({
          label: site.name,
          value: site._id,
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
          label: collection.name,
          value: collection._id,
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
          label: item.name,
          value: item._id,
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
    /**
     * Get the base api url;
     *
     * @returns {string} The base api url.
     */
    _apiUrl() {
      return "https://api.webflow.com/";
    },
    async _makeRequest(path, {
      config = {}, $,
    }) {
      return await axios($ ?? this, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this._authToken()}`,
          "accept-version": "1.0.0",
        },
        ...config,
      });
    },
    _createApiClient() {
      return new Webflow({
        token: this._authToken(),
      });
    },
    async listSites() {
      const apiClient = this._createApiClient();
      return apiClient.sites();
    },
    async createWebhook(siteId, url, triggerType, filter = {}) {
      const apiClient = this._createApiClient();
      const params = {
        siteId,
        triggerType,
        url,
        filter,
      };
      return apiClient.createWebhook(params);
    },
    async removeWebhook(siteId, webhookId) {
      const apiClient = this._createApiClient();
      const params = {
        siteId,
        webhookId,
      };
      return apiClient.removeWebhook(params);
    },
    async getOrder({
      siteId, orderId, $,
    }) {
      return await this._makeRequest(`/sites/${siteId}/order/${orderId}`, {
        $,
      });
    },
    async getOrders({
      page, siteId, status, $,
    }) {
      return await this._makeRequest(`/sites/${siteId}/orders`, {
        $,
        config: {
          params: {
            status: status,
            offset: page ?? 0,
            limit: 100,
          },
        },
      });
    },
    async getDomains(siteId) {
      const webflow = this._createApiClient();

      return await webflow.domains({
        siteId,
      });
    },
    async getSite(siteId) {
      const webflow = this._createApiClient();

      return await webflow.site({
        siteId,
      });
    },
    async getSites() {
      const webflow = this._createApiClient();

      return await webflow.sites();
    },
    async getCollection(collectionId) {
      const webflow = this._createApiClient();

      return await webflow.collection({
        collectionId,
      });
    },
    async getCollections(siteId) {
      const webflow = this._createApiClient();

      if (!siteId) return [];

      return await webflow.collections({
        siteId: siteId,
      });
    },
    async getItems(page = 0, collectionId) {
      const webflow = this._createApiClient();

      if (!collectionId) return [];

      const response = await webflow.items({
        collectionId,
      }, {
        limit: 100,
        offset: page,
      });

      return response.items;
    },
  },
};
