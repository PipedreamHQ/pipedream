import cloudflare from "../../cloudflare_api_key.app.mjs";

export default {
  key: "cloudflare_api_key-query-worker-analytics",
  name: "Query Worker Analytics",
  description: "Retrieves Workers KV request metrics for the given account. [See the docs here](https://api.cloudflare.com/#workers-kv-request-analytics-query-request-analytics)",
  version: "0.0.1",
  type: "action",
  props: {
    cloudflare,
    account: {
      propDefinition: [
        cloudflare,
        "accountIdentifier",
      ],
      description: "The account to query",
    },
  },
  async run({ $ }) {
    const response = await this.cloudflare.getWorkerAnalytics($, this.account);

    $.export("$summary", "Successfully retrieved worker analytics.");

    return response;
  },
};
