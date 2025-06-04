import { axios } from "@pipedream/platform";
import app from "../../new_relic.app.mjs";

/**
 * Query logs from New Relic using NRQL, supporting pagination via nextCursor and robust error handling.
 */
export default {
    name: "Query Logs",
    description: "Query logs from New Relic using NRQL. Supports pagination for large result sets and includes comprehensive error handling.",
    key: "new_relic-query-logs",
    version: "0.0.3",
    type: "action",
    props: {
        app,
        accountId: {
            type: "string",
            label: "Account ID",
        },
        nrql: {
            type: "string",
            label: "NRQL Query",
            description: "The NRQL query to run against logs. Example: `SELECT * FROM Log WHERE message LIKE '%error%' LIMIT 1000`",
        },
    },
    async run({ $ }) {
        try {
            // Validate accountId is a numeric string
            if (!/^\d+$/.test(this.accountId)) {
                throw new Error("Account ID must be a numeric string");
            }

            const url = `https://api.newrelic.com/graphql`;
            const headers = this.app._getHeaders();
            let allResults = [];
            let nextCursor = null;

            do {
                const query = `{
        actor {
          account(id: ${this.accountId}) {
            nrql(query: \"${this.nrql}\"${nextCursor ? `, nextCursor: \"${nextCursor}\"` : ""}) {
              results
              nextCursor
            }
          }
        }
      }`;
                const response = await axios(this, {
                    method: "POST",
                    url,
                    headers,
                    data: { query },
                });

                // Handle GraphQL errors
                if (response.data.errors) {
                    throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
                }

                const nrqlData = response.data?.data?.actor?.account?.nrql;
                if (!nrqlData) {
                    throw new Error("Invalid response structure from New Relic API");
                }

                if (nrqlData.results) allResults.push(...nrqlData.results);
                nextCursor = nrqlData.nextCursor;
            } while (nextCursor);

            $.export("$summary", `Queried logs with NRQL: ${this.nrql}. Total results: ${allResults.length}`);
            return allResults;
        } catch (error) {
            throw new Error(`Failed to query New Relic logs: ${error.message}`);
        }
    },
}; 