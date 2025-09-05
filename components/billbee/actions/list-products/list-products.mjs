import app from "../../billbee.app.mjs";

export default {
  key: "billbee-list-products",
  name: "List Products",
  description: "Retrieve a list of products. [See the documentation](https://app.billbee.io//swagger/ui/index#/Products/Article_GetList)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    minCreatedAt: {
      type: "string",
      label: "Minimum Created Date",
      description: "Filter products created after this date (ISO format). Eg. `2025-01-01`",
      optional: true,
    },
    minimumBillBeeArticleId: {
      type: "integer",
      label: "Minimum Billbee Article ID",
      description: "Filter products with Billbee article ID greater than or equal to this value",
      optional: true,
    },
    maximumBillBeeArticleId: {
      type: "integer",
      label: "Maximum Billbee Article ID",
      description: "Filter products with Billbee article ID less than or equal to this value",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Maximum Results",
      description: "Maximum number of products to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      max,
      minCreatedAt,
      minimumBillBeeArticleId,
      maximumBillBeeArticleId,
    } = this;

    const products = await app.paginate({
      resourcesFn: app.listProducts,
      resourcesFnArgs: {
        $,
        params: {
          minCreatedAt,
          minimumBillBeeArticleId,
          maximumBillBeeArticleId,
        },
      },
      resourceName: "Data",
      max,
    });

    $.export("$summary", `Successfully retrieved \`${products.length}\` products`);

    return products;
  },
};
