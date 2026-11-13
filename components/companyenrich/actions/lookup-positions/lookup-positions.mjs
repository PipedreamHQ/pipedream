import companyenrich from "../../companyenrich.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-lookup-positions",
  name: "Lookup Positions",
  description: "Find up to 10 positions suggestions for search filters. Does not consume credits. Empty query returns an empty list. [See the documentation](https://docs.companyenrich.com/reference/get_v2-positions-autocomplete)",
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
      description: "Prefix or search text for suggestions, e.g. `engineer`. At most 100 characters; an empty string returns no suggestions.",
    },
  },
  /**
   * Validate the query and retrieve job-position suggestions for people filters.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The position suggestion response.
   */
  async run({ $ }) {
    if (typeof this.query !== "string" || this.query.length > 100) {
      throw new ConfigurationError("Query must be a string of at most 100 characters.");
    }
    const response = await this.companyenrich.lookupPositions({
      $,
      params: {
        query: this.query,
      },
    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} suggestions`);
    return response;
  },
};
