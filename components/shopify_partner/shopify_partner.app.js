require("graphql/language");
const get = require("lodash/get");
const { GraphQLClient } = require("graphql-request");

module.exports = {
  type: "app",
  app: "shopify_partner",
  methods: {
    /**
     * Handle a Shopify Partner GraphQL query
     *
     * Includes pagination, based off of a recusion or the last stored cursor in the $service.db
     */
    async query({
      query,
      db,
      mutation,
      variables,
      handleEmit,
      key,
      hasNextPagePath = "transactions.pageInfo.hasNextPage",
      cursorPath = "transactions[0].edges[0].cursor",
    }) {
      const endpoint = `https://partners.shopify.com/${this.$auth.organization_id}/api/2021-04/graphql.json`;
      const client = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.$auth.api_key,
        },
      });

      // the key is unique to the source module, so we should always be getting the last message
      const lastCursor = db.get(key);

      const data = await client.request(query || mutation, {
        ...variables,
        ...(lastCursor || key ? { after: lastCursor } : {}),
      });

      console.log(JSON.stringify(data, null, 2));

      if (data) {
        handleEmit(data);
        // the db becomes the source of truth for the last cursor
        db.set(key, get(data, cursorPath));
      }

      // paginate the results recursively
      //   the hasNextPagePath references how to traverse the response from Shopify
      //   if hasNextPath is truthy, we continue
      if (data && get(data, hasNextPagePath)) {
        await this.query({
          query,
          mutation,
          handleEmit,
          variables: {
            after: get(data, cursorPath),
            ...variables,
          },
        });
      }
    },
  },
};
