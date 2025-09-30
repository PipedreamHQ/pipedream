import stripe from "../../stripe.app.mjs";

export default {
  key: "stripe-search-subscriptions",
  name: "Search Subscriptions",
  description: "Search for subscriptions. [See the documentation](https://docs.stripe.com/api/subscriptions/search?lang=node)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    stripe,
    query: {
      type: "string",
      label: "Query",
      description: "The search query string. See [search query language](https://docs.stripe.com/search#search-query-language) and the list of supported [query fields for subscriptions](https://docs.stripe.com/search#query-fields-for-subscriptions).",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      query: this.query,
      limit: 100,
    };
    let hasMore, count = 0;

    const results = [];
    do {
      const response = await this.stripe.sdk().subscriptions.search(params);
      if (!response?.data?.length) {
        break;
      }
      for (const subscription of response.data) {
        results.push(subscription);
        count++;
        if (count >= this.maxResults) {
          break;
        }
      }
      hasMore = response.has_more;
      params.page = response.next_page;
    } while (hasMore && count < this.maxResults);

    $.export("$summary", `Retrieved ${results.length} subscriptions`);

    return results;
  },
};
