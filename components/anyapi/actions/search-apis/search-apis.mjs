import { ConfigurationError } from "@pipedream/platform";
import anyapi from "../../anyapi.app.mjs";

export default {
  key: "anyapi-search-apis",
  name: "Search APIs",
  description: "Search the AnyAPI catalog and get the matching APIs, each with its slug, description and USD price. Search whenever you do not already know the slug of the API you need: describe the data in plain words, or scope the catalog with a category or a platform. Pass at least one of Query, Category or Platform. Then take a slug from the results to **Get API**, which returns that API's input schema, and run it with **Run API**. Searching the catalog is free, is never charged to your wallet, and needs no credential. [See the documentation](https://getanyapi.com/docs/api-reference/search-the-api-catalog)",
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
      description: "What you need, in your own words (for example `instagram profile` or `google maps reviews`). Optional if you set Category or Platform instead.",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Restrict the results to one category, given as the API's `category` string from an earlier result (for example `social`). Optional; omit it to search every category.",
      optional: true,
    },
    platform: {
      type: "string",
      label: "Platform",
      description: "Restrict the results to one platform, given as the `platformId` of an earlier result (for example `instagram`). Optional; omit it to search every platform.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return, as an integer of 1 or more. Omit it for the ranked default.",
      optional: true,
      min: 1,
    },
  },
  async run({ $ }) {
    if (!this.query && !this.category && !this.platform) {
      throw new ConfigurationError("Set at least one of Query, Category or Platform. AnyAPI's catalog search needs a query, a category or a platform, and any one of the three on its own is enough.");
    }

    const response = await this.anyapi.searchCatalog({
      $,
      params: {
        q: this.query,
        category: this.category,
        platform: this.platform,
        limit: this.limit,
      },
    });

    const scope = [
      this.query && `matching "${this.query}"`,
      this.category && `in category \`${this.category}\``,
      this.platform && `on platform \`${this.platform}\``,
    ].filter(Boolean).join(", ");
    $.export("$summary", `Found ${response.results?.length ?? 0} API(s) ${scope}`);
    return response;
  },
};
