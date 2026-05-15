import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-list-redeem-pages",
  name: "List Redeem Pages",
  description: "Retrieve a list of private-enabled redeem pages. [See the documentation](https://corporatemerch.readme.io/reference/retrieve-a-list-of-links)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    corporateMerch,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return per page. Must be ≤ 50. Defaults to `15`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.listRedeemPages({
      $,
      params: {
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? response.length ?? 0} redeem page(s)`);
    return response;
  },
};
