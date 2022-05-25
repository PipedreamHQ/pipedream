import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-all-products-sort-order",
  name: "Get All Products Sort Order",
  description:
    "Get all your products. [See the docs here](https://developer.bigcommerce.com/api-reference/90ab7265480e2-get-product-sort-order)",
  version: "0.0.1",
  type: "action",
  props: {
    bigcommerce,
    categoryId: {
      propDefinition: [
        bigcommerce,
        "categoryId",
      ],
    },
    maxRequests: {
      propDefinition: [
        bigcommerce,
        "maxRequests",
      ],
    },
  },
  async run({ $ }) {
    let items = [];
    let total = 0;
    let count = 0;
    do {
      count++;
      const response = await this.bigcommerce.getAllProductsSortOrder({
        $,
        categoryId: this.categoryId,
        page: count,
      });
      const {
        data,
        meta: { pagination },
      } = response;
      total = pagination.total;
      data.forEach((item) => {
        items.push(item);
      });
    } while (items.length < total && count < this.maxRequests);

    $.export("$summary", "Successfully fetched all products");
    return items;
  },
};
