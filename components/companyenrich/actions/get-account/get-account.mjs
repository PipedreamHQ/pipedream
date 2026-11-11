import companyenrich from "../../companyenrich.app.mjs";

export default {
  key: "companyenrich-get-account",
  name: "Get Account",
  description: "Read your account credit usage and capabilities without consuming credits. Returns only account ID, credit information and capabilities; credentials are omitted. Use this to check preview availability before running preview actions. [See the documentation](https://docs.companyenrich.com/reference/get_v2-me)",
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
   * Retrieve account usage and capabilities through the credential-safe app method.
   * @param {Object} context - Pipedream action execution context.
   * @param {Object} context.$ - Execution context used for requests and the result summary.
   * @returns {Promise<Object>} Only the account ID, credits and supported capability fields.
   */
  async run({ $ }) {
    const response = await this.companyenrich.getAccount({
      $,

    });
    $.export("$summary", "Retrieved account credits and capabilities");
    return response;
  },
};
