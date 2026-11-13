import companyenrich from "../../companyenrich.app.mjs";
import { companyQuery } from "../../common/utils.mjs";

export default {
  key: "companyenrich-preview-companies",
  name: "Preview Companies",
  description: "Preview up to 25 company summaries without consuming credits. Requires the corresponding preview capability on your plan. No pagination or paid expansions. [See the documentation](https://docs.companyenrich.com/reference/post_v2-companies-search-preview)",
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
    companyFilter: {
      propDefinition: [
        companyenrich,
        "companyFilter",
      ],
    },
    semantic: {
      propDefinition: [
        companyenrich,
        "semantic",
      ],
    },
    lookalike: {
      propDefinition: [
        companyenrich,
        "lookalike",
      ],
    },
  },
  /**
   * Preview companies matching the configured query without expansions or pagination.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The limited company summaries allowed by the preview endpoint.
   */
  async run({ $ }) {
    const response = await this.companyenrich.previewCompanies({
      $,
      data: companyQuery(this),
    });
    $.export("$summary", `Previewed ${response.items?.length ?? 0} companies`);
    return response;
  },
};
