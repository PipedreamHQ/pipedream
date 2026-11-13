import companyenrich from "../../companyenrich.app.mjs";

export default {
  key: "companyenrich-list-industries",
  name: "List Industries",
  description: "List industries and their NAICS code prefixes. Use the returned string codes in the company filter naicsCodes field. Does not consume credits. [See the documentation](https://docs.companyenrich.com/reference/get_v2-industries)",
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

  },
  /**
   * Retrieve the industry taxonomy for use in company search filters.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} The industries and their NAICS code prefixes.
   */
  async run({ $ }) {
    const response = await this.companyenrich.listIndustries({
      $,

    });
    $.export("$summary", `Retrieved ${response.items?.length ?? 0} industries`);
    return response;
  },
};
