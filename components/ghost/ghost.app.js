const axios = require("axios");

module.exports = {
  type: "app",
  app: "ghost_org_content_api",
  methods: {
    async _makeRequest(endpoint, page) {
      limit = 15;
      return (results = await axios.get(
        `${this.$auth.admin_domain}/ghost/api/v3/content/${endpoint}?key=${this.$auth.content_api_key}&limit=${limit}&page=${page}`
      ));
    },
    async getAuthors(page) {
      return this._makeRequest("authors", page);
    },
  },
};