const axios = require("axios");
const Bottleneck = require('bottleneck');
// limiting requests to 2 per second per Shopify's API rate limit documentation
// https://shopify.dev/concepts/about-apis/rate-limits
const limiter = new Bottleneck({
  minTime: 500
});
const get = require("lodash.get");
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
      description:
        "Only emit events for the selected event types.",
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
    async getObjects(objectType, endpoint, useCreatedAt=false, sinceId=null, params={}) {
      let hasMore = true;
      const objects = [];
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}/${endpoint}`,
        headers: this._getAuthHeader(),
        params,
      };
      if (sinceId)
        config.params.since_id = sinceId;
      // if no sinceId, get objects created within the last month
      else if (useCreatedAt)
        config.params.created_at_min = this._monthAgo();
      // wrap the API request with Bottleneck to avoid exceeding Shopify's rate limit
      const throttledGetObjectsData = limiter.wrap(this.getObjectsData);
      while (hasMore) {
        const results = await throttledGetObjectsData(config);
        let link = get(results, "headers.link"); // get link to next page of results
        if (link && link.includes("next")) {
          link = /https.*\>/.exec(link);
          config.url = link[0].substring(0, link[0].length - 1);
          if (config.params.hasOwnProperty('created_at_min'))
            delete config.params.created_at_min;
        } else hasMore = false;
        for (const object of results.data[objectType]) {
          objects.push(object);
        }
      }
      return objects;
    },
    async getObjectsData(config) {
      return await axios(config);
    }, 
    async getAbandonedCheckouts(sinceId) {
      return await this.getObjects("checkouts", "checkouts.json", true, sinceId);
    },
    async getArticles(blogId, sinceId) {
      return await this.getObjects("articles", `blogs/${blogId}/articles.json`, true, sinceId);
    },
    async getBlogs() {
      return await this.getObjects("blogs", "blogs.json");
    },
    async getCustomers(sinceId) {
      return await this.getObjects("customers", "customers.json", true, sinceId);
    },
    async getEvents(sinceId, filter=null, verb=null) {
      const params = {
        filter,
        verb,
      }
      return await this.getObjects("events", "events.json", true, sinceId, params);
    },
    async getOrders(fulfillmentStatus, useCreatedAt=false, sinceId=null) {
      return await this.getObjects("orders", `orders.json?status=any&fulfillment_status=${fulfillmentStatus}`, useCreatedAt, sinceId);
    },
    async getPages(sinceId) {
      return await this.getObjects("pages", "pages.json", true, sinceId);
    },
    async getProducts(sinceId) {
      return await this.getObjects("products", "products.json", true, sinceId);
    },
  },
};
