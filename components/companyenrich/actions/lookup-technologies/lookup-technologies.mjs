import companyenrich from "../../companyenrich.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-lookup-technologies",
  name: "Lookup Technologies",
  description: "Find up to 10 technologies suggestions for search filters. Does not consume credits. Empty query returns an empty list. [See the documentation](https://docs.companyenrich.com/reference/get_v2-technologies-autocomplete)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    query: {
      propDefinition: [
        companyenrich,
        "query",
      ],
      optional: false,
      description: "Prefix or search text for suggestions, e.g. `shop`. At most 100 characters; an empty string returns no suggestions.",
    },
  },
  /**
   * Validate the query and retrieve technology suggestions for company filters.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The technology suggestion response.
   */
  async run({ $ }) {
    if (typeof this.query !== "string" || this.query.length > 100) {
      throw new ConfigurationError("Query must be a string of at most 100 characters.");
    }
    const response = await this.companyenrich.lookupTechnologies({
      $,
      params: {
        query: this.query,
      },
    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} suggestions`);
    return response;
  },
};
