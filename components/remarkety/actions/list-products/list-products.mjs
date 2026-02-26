import remarkety from "../../remarkety.app.mjs";

export default {
  key: "remarkety-list-products",
  name: "List Products",
  description: "List Products. [See the documentation](http://static.remarkety.com.s3-website-us-east-1.amazonaws.com/api-docs/#!/Products/get_products)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    remarkety,
    page: {
      propDefinition: [
        remarkety,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        remarkety,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.remarkety.listProducts({
      $,
      params: {
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.products?.length ?? 0} product${response.products?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
