const axios = require("axios");

module.exports = {
  type: "app",
  app: "ghost_org_content_api",
  methods: {
    async getAuthors(page, latestId) {
      const limit = 15;
      return (results = await axios.get(
        `${this.$auth.admin_domain}/ghost/api/v3/content/authors?key=${this.$auth.content_api_key}&limit=${limit}&page=${page}&filter=id:>'${latestId}'`
      ));
    },
  },
};