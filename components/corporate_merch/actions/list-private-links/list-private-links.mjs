import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-list-private-links",
  name: "List Private Links",
  description: "Retrieve a paginated list of all private links associated with a redeem page. [See the documentation](https://corporatemerch.readme.io/reference/retrieve-a-list-of-private-links)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    corporateMerch,
    redeemPageId: {
      type: "string",
      label: "Redeem Page ID",
      description: "The ID of the redeem page to list private links for. Use the **List Redeem Pages** action to find available redeem page IDs.",
    },
    limit: {
      propDefinition: [
        corporateMerch,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.listPrivateLinks({
      $,
      redeemPageId: this.redeemPageId,
      params: {
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? response.length ?? 0} private link(s)`);
    return response;
  },
};
