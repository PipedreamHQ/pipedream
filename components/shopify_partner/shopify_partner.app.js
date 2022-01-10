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
     * @param {String} query - the query passed to the Shopify Partner API
     * @param {Db} db - the Pipedream database for getting/setting cursors for pagination
     * @param {String} mutation - the mutation passed to the Shopify Partner API
     * @param {Object} variables - variables passed to a query or mutation
     * @param {Funciton} handleEmit - handles event emission given the response data
     * @param {String} key - the unique key to retrieve the cursor from the db
     * @param {String} hasNextPagePath - the path to test if a next page is discoverable
     * @param {String} cursorPath - the path to find the pagination cursor in the response
     */
    async query({
      query,
      db,
      mutation,
      variables,
      handleEmit,
      key = "",
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

      console.log(`lastCursor: ${lastCursor}`);

      const data = await client.request(query || mutation, {
        ...variables,
        ...(lastCursor
          ? {
            after: lastCursor,
          }
          : {}),
      });

      console.log(JSON.stringify(data, null, 2));

      if (data) {
        handleEmit(data);
        // the db becomes the source of truth for the last cursor
        //   return null because undefined causes a bug
        db.set(key, get(data, cursorPath, null));
      }

      // paginate the results recursively
      //   the hasNextPagePath references how to traverse the response from Shopify
      //   if hasNextPath is truthy, we continue
      if (data && get(data, hasNextPagePath)) {
        await this.query({
          db,
          key,
          query,
          mutation,
          cursorPath,
          hasNextPagePath,
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
