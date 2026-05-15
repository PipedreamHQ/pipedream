import corporateMerch from "../../corporate_merch.app.mjs";

export default {
  key: "corporate_merch-list-products",
  name: "List Products",
  description: "Retrieve a list of products from the catalog. [See the documentation](https://corporatemerch.readme.io/reference/list-catalog)",
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
      description: "Maximum number of results to return per page. Defaults to `15`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to return for pagination.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.corporateMerch.listProducts({
      $,
      params: {
        limit: this.limit,
        page: this.page,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length ?? response.length ?? 0} product(s)`);
    return response;
  },
};
