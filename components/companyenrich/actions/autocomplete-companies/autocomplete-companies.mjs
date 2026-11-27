import companyenrich from "../../companyenrich.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "companyenrich-autocomplete-companies",
  name: "Autocomplete Companies",
  description: "Find up to 10 companies by a domain prefix. Returns company IDs for **Get Company**. Does not consume credits. Empty query returns an empty list. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-autocomplete)",
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
      description: "Prefix or search text for suggestions, e.g. `example`. At most 100 characters; an empty string returns no suggestions.",
    },
  },
  /**
   * Validate the domain prefix and retrieve company suggestions.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The autocomplete response with company IDs and domains.
   */
  async run({ $ }) {
    if (typeof this.query !== "string" || this.query.length > 100) {
      throw new ConfigurationError("Query must be a string of at most 100 characters.");
    }
    const response = await this.companyenrich.autocompleteCompanies({
      $,
      params: {
        query: this.query,
      },
    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} suggestions`);
    return response;
  },
};
