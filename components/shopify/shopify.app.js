const axios = require("axios");
const crypto = require("crypto");
const get = require("lodash.get");

module.exports = {
  type: "app",
  app: "shopify",
  methods: {
    _getBaseURL() {
      return `https://${this.$auth.shop_id}.myshopify.com/admin/api/2020-10`;
    },
    _getAuthHeader() {
      return {
        "x-shopify-access-token": this.$auth.oauth_access_token,
      };
    },
    async getObjects(object_type, endpoint, since_id = null) {
      let hasMore = true;
      const objects = [];
      const config = {
        method: "GET",
        url: `${this._getBaseURL()}/${endpoint}`,
        headers: this._getAuthHeader(),
        params: {
          since_id,
        },
      };
      while (hasMore) {
        let results = await axios(config);
        let link = get(results, "headers.link"); // get link to next page of results
        if (link && link.includes("next")) {
          link = /https.*\>/.exec(link);
          config.url = link[0].substring(0, link[0].length - 1);
        } else hasMore = false;
        for (const object of results.data[object_type]) {
          objects.push(object);
        }
      }
      return objects;
    },
    async getAbandonedCheckouts(since_id) {
      return await this.getObjects("checkouts", "checkouts.json", since_id);
    },
    async getArticles(blog_id, since_id) {
      return await this.getObjects(
        "articles",
        `blogs/${blog_id}/articles.json`,
        since_id
      );
    },
    async getBlogs() {
      return await this.getObjects("blogs", "blogs.json");
    },
    async getPages(since_id) {
      return await this.getObjects("pages", "pages.json", since_id);
    },
  },
};