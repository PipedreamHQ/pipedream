import anyapi from "../../anyapi.app.mjs";

export default {
  key: "anyapi-search-apis",
  name: "Search APIs",
  description: "Search the AnyAPI catalog and get the matching APIs, each with its slug, description and USD price. No credential is required for this endpoint. [See the documentation](https://getanyapi.com/docs/api-reference/search-the-api-catalog)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    anyapi,
    query: {
      type: "string",
      label: "Query",
      description: "What you need, in your own words (for example `instagram profile` or `google maps reviews`).",
    },
    category: {
      type: "string",
      label: "Category",
      description: "Restrict the results to one category, using the `category` of an earlier result.",
      optional: true,
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Restrict the results to one platform, using the `platformId` of an earlier result (for example `instagram`).",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return. Omit it for the ranked default.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.anyapi.searchCatalog({
      $,
      params: {
        q: this.query,
        category: this.category,
        platform: this.platform,
        limit: this.limit,
      },
    });

    $.export("$summary", `Found ${response.results?.length ?? 0} API(s) matching "${this.query}"`);
    return response;
  },
};
