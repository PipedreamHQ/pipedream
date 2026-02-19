import remarkety from "../../remarkety.app.mjs";

export default {
  key: "remarkety-list-customers",
  name: "List Customers",
  description: "List Customers. [See the documentation](http://static.remarkety.com.s3-website-us-east-1.amazonaws.com/api-docs/#!/Customers/get_customers)",
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
    const response = await this.remarkety.listCustomers({
      $,
      params: {
        page: this.page,
        limit: this.limit,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.customers?.length ?? 0} customer${response.customers?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
