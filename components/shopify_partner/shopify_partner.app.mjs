import "graphql/language/index.js";
import get from "lodash/get.js";
import { GraphQLClient } from "graphql-request";

export default {
  type: "app",
  app: "shopify_partner",
  propDefinitions: {
    appId: {
      type: "string",
      description: "gid://partners/App/<your App ID here>",
      label: "Shopify App ID",
    },
    occurredAtMin: {
      type: "string",
      description:
        "Only include events after this specific time (ISO timestamp)",
      label: "occurredAtMin",
      optional: true,
    },
    occurredAtMax: {
      type: "string",
      description:
        "Only include events up to this specific time (ISO timestamp)",
      label: "occurredAtMax",
      optional: true,
    },
    paginationEnabled: {
      type: "boolean",
      label: "Paginate results",
      description: "Paginate through all of your Shopify Partner records until occurredAtMin is reached. This can cause many invocations.",
      default: false,
    },
  },
  methods: {
    /**
     * Handle a Shopify Partner GraphQL query
     *
     * Includes pagination, based off of a recursion or the last stored cursor in the $.service.db
     * @param {String} query - the query passed to the Shopify Partner API
     * @param {Db} db - the Pipedream database for getting/setting cursors for pagination
     * @param {String} mutation - the mutation passed to the Shopify Partner API
     * @param {Object} variables - variables passed to a query or mutation
     * @param {Function} handleEmit - handles event emission given the response data
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
      getCursor,
    }) {
      const endpoint = `https://partners.shopify.com/${this.$auth.organization_id}/api/2021-07/graphql.json`;
      const client = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.$auth.api_key,
        },
      });

      // the key is unique to the source module, so we should always be getting the last message
      const lastCursor = db.get(key);

      const queryVars = {
        ...variables,
        ...(lastCursor && this.paginationEnabled
          ? {
            after: lastCursor,
          }
          : {}),
      };

      console.log("queryVars", queryVars);

      const data = await client.request(query || mutation, queryVars);
      console.log(JSON.stringify(data, null, 4));

      if (data) {
        handleEmit(data);
        const cursor = getCursor(data);
        if (cursor) {
          db.set(key, getCursor(data));
        }
      }

      // paginate the results recursively if enabled
      if (data && get(data, hasNextPagePath) && this.paginationEnabled) {
        await this.query({
          db,
          key,
          query,
          mutation,
          getCursor,
          hasNextPagePath,
          handleEmit,
          variables,
        });
      }
    },
  },
};
