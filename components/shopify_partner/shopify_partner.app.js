require("graphql/language");
const { GraphQLClient } = require("graphql-request");

module.exports = {
  type: "app",
  app: "shopify_partner",
  methods: {
    async query({ query, mutation, variables }) {
      const endpoint = `https://partners.shopify.com/${this.$auth.organization_id}/api/2021-04/graphql.json`;
      const client = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.$auth.api_key,
        },
      });

      return await client.request(query || mutation, variables);
    },
  },
};
