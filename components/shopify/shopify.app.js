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
  { label: "Blog Updated", value: JSON.stringify({ filter: "Blog", verb: "update" }) }, 
  { label: "Collection Created", value: JSON.stringify({ filter: "Collection", verb: "create" }) }, 
  { label: "Collection Destroyed", value: JSON.stringify({ filter: "Collection", verb: "destroy" }) }, 
  { label: "Collection Published", value: JSON.stringify({ filter: "Collection", verb: "published" }) }, 
  { label: "Collection Unpublished", value: JSON.stringify({ filter: "Collection", verb: "unpublished" }) }, 
  { label: "Collection Updated", value: JSON.stringify({ filter: "Collection", verb: "update" }) }, 
  { label: "Comment Created", value: JSON.stringify({ filter: "Comment", verb: "create" }) }, 
  { label: "Order Authorization Failure", value: JSON.stringify({ filter: "Order", verb: "authorization_failure" }) }, 
  { label: "Order Authorization Pending", value: JSON.stringify({ filter: "Order", verb: "authorization_pending" }) }, 
  { label: "Order Authorization Success", value: JSON.stringify({ filter: "Order", verb: "authorization_success" }) }, 
  { label: "Order Cancelled", value: JSON.stringify({ filter: "Order", verb: "cancelled" }) }, 
  { label: "Order Capture Failure", value: JSON.stringify({ filter: "Order", verb: "capture_failure" }) }, 
  { label: "Order Capture Pending", value: JSON.stringify({ filter: "Order", verb: "capture_pending" }) }, 
  { label: "Order Capture Success", value: JSON.stringify({ filter: "Order", verb: "capture_success" }) }, 
  { label: "Order Closed", value: JSON.stringify({ filter: "Order", verb: "closed" }) }, 
  { label: "Order Confirmed", value: JSON.stringify({ filter: "Order", verb: "confirmed" }) }, 
  { label: "Order Fulfillment Cancelled", value: JSON.stringify({ filter: "Order", verb: "fulfillment_cancelled" }) }, 
  { label: "Order Fulfillment Pending", value: JSON.stringify({ filter: "Order", verb: "fulfillment_pending" }) }, 
  { label: "Order Fulfillment Success", value: JSON.stringify({ filter: "Order", verb: "fulfillment_success" }) }, 
  { label: "Order Mail Sent", value: JSON.stringify({ filter: "Order", verb: "mail_sent" }) }, 
  { label: "Order Placed", value: JSON.stringify({ filter: "Order", verb: "placed" }) }, 
  { label: "Order Reopened", value: JSON.stringify({ filter: "Order", verb: "re_opened" }) }, 
  { label: "Order Refund Failure", value: JSON.stringify({ filter: "Order", verb: "refund_failure" }) }, 
  { label: "Order Refund Pending", value: JSON.stringify({ filter: "Order", verb: "refund_pending" }) }, 
  { label: "Order Refund Success", value: JSON.stringify({ filter: "Order", verb: "refund_success" }) }, 
  { label: "Order Restocked", value: JSON.stringify({ filter: "Order", verb: "restock_line_items" }) }, 
  { label: "Order Sale Failure", value: JSON.stringify({ filter: "Order", verb: "sale_failure" }) }, 
  { label: "Order Sale Pending", value: JSON.stringify({ filter: "Order", verb: "sale_pending" }) }, 
  { label: "Order Sale Success", value: JSON.stringify({ filter: "Order", verb: "sale_success" }) }, 
  { label: "Order Updated", value: JSON.stringify({ filter: "Order", verb: "update" }) }, 
  { label: "Order Void Failure", value: JSON.stringify({ filter: "Order", verb: "void_failure" }) }, 
  { label: "Order Void Pending", value: JSON.stringify({ filter: "Order", verb: "void_pending" }) }, 
  { label: "Order Void Success", value: JSON.stringify({ filter: "Order", verb: "void_success" }) }, 
  { label: "Page Created", value: JSON.stringify({ filter: "Page", verb: "create" }) }, 
  { label: "Page Destroyed", value: JSON.stringify({ filter: "Page", verb: "destroy" }) }, 
  { label: "Page Published", value: JSON.stringify({ filter: "Page", verb: "published" }) }, 
  { label: "Page Unpublished", value: JSON.stringify({ filter: "Page", verb: "unpublished" }) }, 
  { label: "Page Updated", value: JSON.stringify({ filter: "Page", verb: "update" }) }, 
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
    getShopifyInstance() {
      return new Shopify({
        shopName: this.$auth.shop_id,
        accessToken: this.$auth.oauth_access_token,
        autoLimit: true,
      });
    },
    getSinceParams(sinceId = false, useCreatedAt = false) {
      if (sinceId) return { since_id: sinceId };
      // if no sinceId, get objects created within the last month
      else if (useCreatedAt) return { created_at_min: this._monthAgo() };
      return {};
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
    async getCustomers(sinceId) {
      let params = this.getSinceParams(sinceId, true);
      return await this.getObjects("customer", params);
    },
    async getEvents(sinceId, filter = null, verb = null) {
      let params = this.getSinceParams(sinceId, true);
      params.filter = filter;
      params.verb = verb;
      return await this.getObjects("event", params);
    },
    async getOrders(fulfillmentStatus, useCreatedAt = false, sinceId = null) {
      let params = this.getSinceParams(sinceId, useCreatedAt);
      params.status = "any";
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
