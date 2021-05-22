const axios = require("axios");
const get = require("lodash.get");
const Shopify = require("shopify-api-node");
const events = [
  { label: "Article Created", value: JSON.stringify({ filter: "Article", verb: "create" }) }, 
  { label: "Article Destroyed", value: JSON.stringify({ filter: "Article", verb: "destroy" }) }, 
  { label: "Article Published", value: JSON.stringify({ filter: "Article", verb: "published" }) },
  { label: "Article Unpublished", value: JSON.stringify({ filter: "Article", verb: "unpublished" }) }, 
  { label: "Article Updated", value: JSON.stringify({ filter: "Article", verb: "update" }) }, 
  { label: "Blog Created", value: JSON.stringify({ filter: "Blog", verb: "create" }) }, 
  { label: "Blog Destroyed", value: JSON.stringify({ filter: "Blog", verb: "destroy" }) }, 
  { label: "Collection Created", value: JSON.stringify({ filter: "Collection", verb: "create" }) }, 
  { label: "Collection Destroyed", value: JSON.stringify({ filter: "Collection", verb: "destroy" }) }, 
  { label: "Collection Published", value: JSON.stringify({ filter: "Collection", verb: "published" }) }, 
  { label: "Collection Unpublished", value: JSON.stringify({ filter: "Collection", verb: "unpublished" }) }, 
  { label: "Order Confirmed", value: JSON.stringify({ filter: "Order", verb: "confirmed" }) }, 
  { label: "Page Created", value: JSON.stringify({ filter: "Page", verb: "create" }) }, 
  { label: "Page Destroyed", value: JSON.stringify({ filter: "Page", verb: "destroy" }) }, 
  { label: "Page Published", value: JSON.stringify({ filter: "Page", verb: "published" }) }, 
  { label: "Page Unpublished", value: JSON.stringify({ filter: "Page", verb: "unpublished" }) }, 
  { label: "Price Rule Created", value: JSON.stringify({ filter: "PriceRule", verb: "create" }) }, 
  { label: "Price Rule Destroyed", value: JSON.stringify({ filter: "PriceRule", verb: "destroy" }) }, 
  { label: "Price Rule Updated", value: JSON.stringify({ filter: "PriceRule", verb: "update" }) }, 
  { label: "Product Created", value: JSON.stringify({ filter: "Product", verb: "create" }) }, 
  { label: "Product Destroyed", value: JSON.stringify({ filter: "Product", verb: "destroy" }) }, 
  { label: "Product Published", value: JSON.stringify({ filter: "Product", verb: "published" }) }, 
  { label: "Product Unpublished", value: JSON.stringify({ filter: "Product", verb: "unpublished" }) },  
];

module.exports = {
  type: "app",
  app: "shopify",
  propDefinitions: {
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      optional: true,
      description: "Only emit events for the selected event types.",
      options: events,
    },
  },
  methods: {
    _getBaseURL() {
      return `https://${this.$auth.shop_id}.myshopify.com/admin/api/2020-10`;
    },
    _getAuthHeader() {
      return {
        "x-shopify-access-token": this.$auth.oauth_access_token,
      };
    },
    _monthAgo() {
      const now = new Date();
      const monthAgo = new Date(now.getTime());
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    dayAgo() {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return dayAgo;
    },
    getShopifyInstance() {
      return new Shopify({
        shopName: this.$auth.shop_id,
        accessToken: this.$auth.oauth_access_token,
        autoLimit: true,
        apiVersion: '2021-04'
      });
    },
    async makeGraphQLRequest(query, variables) {
      const shopify = this.getShopifyInstance();
      return await shopify.graphql(query, variables);
    },
    getSinceParams(sinceId = false, useCreatedAt = false, updatedAfter = null) {
      let params = {};
      if (sinceId) params = { ...params, since_id: sinceId };
      if (updatedAfter) params = { ...params, updated_at_min: updatedAfter };
      // if no sinceId or updatedAfter, get objects created within the last month
      if (!sinceId && !updatedAfter && useCreatedAt) return { created_at_min: this._monthAgo() };
      return params;
    },
    async getObjects(objectType, params = {}, id = null) {
      const shopify = this.getShopifyInstance();
      let objects = [];
      do {
        const results = id
          ? await shopify[objectType].list(id, params)
          : await shopify[objectType].list(params);
        objects = objects.concat(results);
        params = results.nextPageParameters;
      } while (params !== undefined);
      return objects;
    },
    async getAbandonedCheckouts(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("checkout", params);
    },
    async getArticles(blogId, sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("article", params, blogId);
    },
    async getBlogs() {
      return await this.getObjects("blog");
    },
    async getCustomers(sinceId, updatedAfter) {
      let params = this.getSinceParams(sinceId, true, updatedAfter);
      return await this.getObjects("customer", params);
    },
    async getEvents(sinceId, filter = null, verb = null) {
      let params = this.getSinceParams(sinceId, true);
      params.filter = filter;
      params.verb = verb;
      return await this.getObjects("event", params);
    },
    async getOrders(fulfillmentStatus, useCreatedAt = false, sinceId = null, updatedAfter = null, status = "any") {
      let params = this.getSinceParams(sinceId, useCreatedAt, updatedAfter);
      params.status = status;
      params.fulfillment_status = fulfillmentStatus;
      return await this.getObjects("order", params);
    },
    async getPages(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("page", params);
    },
    async getProducts(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("product", params);
    },
  },
};
