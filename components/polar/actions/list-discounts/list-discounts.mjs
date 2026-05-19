import app from "../../polar.app.mjs";

export default {
  key: "polar-list-discounts",
  name: "List Discounts",
  description: "List discounts according to the specified filters. [See the API docs](https://polar.sh/docs/api-reference/discounts/list)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      optional: true,
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filter by discount name.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      organizationId: this.organizationId,
      query: this.query,
    };
    const discountList = await this.app.listDiscounts(params);
    $.export("$summary", `Successfully retrieved ${discountList?.items?.length} discount(s)`);
    return discountList;
  },
};
