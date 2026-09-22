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
      propDefinition: [
        corporateMerch,
        "limit",
      ],
    },
    page: {
      propDefinition: [
        corporateMerch,
        "page",
      ],
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
