import { axios } from "@pipedream/platform";
import app from "../../new_relic.app.mjs";

export default {
    name: "Query Logs",
    description: "Query logs from New Relic using NRQL.",
    key: "new_relic-query-logs",
    version: "0.0.1",
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
            description: "The NRQL query to run against logs. Example: `SELECT * FROM Log WHERE message LIKE '%error%' LIMIT 10`",
        },
    },
    async run({ $ }) {
        const url = `https://api.newrelic.com/graphql`;
        const headers = this.app._getHeaders();
        const query = `{
      actor {
        account(id: ${this.accountId}) {
          nrql(query: \"${this.nrql}\") {
            results
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
        $.export("$summary", `Queried logs with NRQL: ${this.nrql}`);
        return response.data;
    },
}; 