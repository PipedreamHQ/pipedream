import "graphql/language/index.js";
import { GraphQLClient } from "graphql-request";

export const PARTNER_API_VERSION = "2024-10";

export default {
  type: "app",
  app: "shopify_partner",
  propDefinitions: {
    appId: {
      type: "string",
      description:
        "Open your app in the partner portal, and look at the URL to find its ID. If your URL is *https://partners.shopify.com/3027494/apps/51358007297/overview*, enter `51358007297` here.",
      label: "Shopify App ID",
      reloadProps: true,
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
    recordsPerRun: {
      type: "integer",
      description: "Number of records to retrieve per run",
      label: "Maximum records to query per run",
      optional: true,
      default: 50,
    },
    paginationDirection: {
      label: "Pagination direction",
      type: "string",
      options: [
        {
          label: "Forwards",
          value: "forward",
        },
        {
          label: "Backwards",
          value: "backward",
        },
      ],
      description:
        "Which direction to paginate through records. Forwards will only look into the future, whereas backwards will comb through all records.",
      default: "forward",
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
      getCursor,
      paginationDirection = "forward",
      recordsPerRun = 50,
    }) {
      const endpoint = `https://partners.shopify.com/${this.$auth.organization_id}/api/${PARTNER_API_VERSION}/graphql.json`;
      const client = new GraphQLClient(endpoint, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": this.$auth.api_key,
        },
      });

      // the key is unique to the source module, so we should always be getting the last message
      console.log("key", key);
      console.log("paginationDirection", paginationDirection);
      const lastCursor = db?.get?.(key);
      const direction = paginationDirection === "forward"
        ? "before"
        : "after";

      console.log("lastCursor", lastCursor);
      console.log("direction", direction);

      const queryVars = {
        ...variables,
        ...(lastCursor
          ? {
            [direction]: lastCursor,
          }
          : {}),
        recordsPerRun,
      };

      console.log("queryVars", queryVars);

      const data = await client.request(query || mutation, queryVars);
      console.log(JSON.stringify(data, null, 4));

      if (data) {
        handleEmit(data);
        const cursor = getCursor(data);
        console.log("getCursor", cursor);
        if (cursor) {
          db.set(key, getCursor(data));
        }
      }
    },
  },
};
