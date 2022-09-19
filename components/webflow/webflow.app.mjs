import Webflow from "webflow-api";
import constants from "./common/constants.mjs";

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
    /**
     * Get the auth access token;
     *
     * @returns {string} The base auth access token.
     */
    _authToken() {
      return this.$auth.oauth_access_token;
    },
    /**
     * Create a Webflow API client;
     *
     * @returns {params} The Webflow API client.
     */
    _createApiClient() {
      return new Webflow({
        token: this._authToken(),
      });
    },
    /**
     * Create a Webflow webhook;
     *
     * @param {siteId} ID of the site to be monitored.
     * @param {url} URL to webhook return.
     * @param {triggerType} Type of event that will be triggered.
     * @param {filter} Filters to be applied in webhook.
     *
     * @returns {params} The Webflow webhook.
     */
    async createWebhook(siteId, url, triggerType, filter = {}) {
      const apiClient = this._createApiClient();

      return apiClient.createWebhook({
        siteId,
        triggerType,
        url,
        filter,
      });
    },
    /**
     * Remove a Webflow webhook;
     *
     * @param {siteId} ID of the site.
     * @param {webhookId} ID of the webhook.
     */
    async removeWebhook(siteId, webhookId) {
      const apiClient = this._createApiClient();
      return apiClient.removeWebhook({
        siteId,
        webhookId,
      });
    },
    /**
     * Get an order;
     *
     * @param {options} Options to filter the order.
     *
     * @returns {params} An order.
     */
    async getOrder({
      siteId, orderId,
    }) {
      const apiClient = this._createApiClient();

      return apiClient.get(`/sites/${siteId}/order/${orderId}`);
    },
    /**
     * Get a list of orders;
     *
     * @param {options} Options to filter the orders.
     *
     * @returns {params} A list of orders.
     */
    async getOrders({
      page, siteId, status,
    }) {
      const apiClient = this._createApiClient();

      return apiClient.get(`/sites/${siteId}/orders`, {
        status: status,
        offset: page ?? 0,
        limit: constants.LIMIT,
      });
    },
    /**
     * Get a list of domains;
     *
     * @param {options} Options to filter the domains.
     *
     * @returns {params} A list of domains.
     */
    async getDomains(siteId) {
      const webflow = this._createApiClient();

      return await webflow.domains({
        siteId,
      });
    },
    /**
     * Get a site;
     *
     * @param {options} Options to filter the site.
     *
     * @returns {params} A site.
     */
    async getSite(siteId) {
      const webflow = this._createApiClient();

      return await webflow.site({
        siteId,
      });
    },
    /**
     * Get a list of sites;
     *
     * @param {options} Options to filter the sites.
     *
     * @returns {params} A list of sites.
     */
    async getSites() {
      const webflow = this._createApiClient();

      return await webflow.sites();
    },
    /**
     * Get a collection;
     *
     * @param {options} Options to filter the collection.
     *
     * @returns {params} A collection.
     */
    async getCollection(collectionId) {
      const webflow = this._createApiClient();

      return await webflow.collection({
        collectionId,
      });
    },
    /**
     * Get a list of collections;
     *
     * @param {options} Options to filter the collections.
     *
     * @returns {params} A list of collections.
     */
    async getCollections(siteId) {
      const webflow = this._createApiClient();

      if (!siteId) return [];

      return await webflow.collections({
        siteId: siteId,
      });
    },
    /**
     * Get a list of items;
     *
     * @param {options} Options to filter the items.
     *
     * @returns {params} A list of items.
     */
    async getItems(page = 0, collectionId) {
      const webflow = this._createApiClient();

      if (!collectionId) return [];

      const response = await webflow.items({
        collectionId,
      }, {
        limit: constants.LIMIT,
        offset: page,
      });

      return response.items;
    },
  },
};
