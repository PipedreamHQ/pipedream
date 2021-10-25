const axios = require("axios");

module.exports = {
  type: "app",
  app: "ghost_org_content_api",
  methods: {
    async getAuthors(page) {
      const config = {
        method: "GET",
        url: `${this.$auth.admin_domain}/ghost/api/v3/content/authors`,
        params: {
          key: this.$auth.content_api_key,
          limit: 15,
          page,
        },
      };
      return await axios(config);
    },
  },
};
