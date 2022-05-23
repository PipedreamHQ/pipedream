import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  key: "bigcommerce-get-all-products",
  name: "Get All Products",
  description:
    "Get all your products. [See the docs here](https://developer.bigcommerce.com/api-reference/4101d472a814d-get-all-products)",
  version: "0.0.1",
  type: "action",
  props: {
    bigcommerce,
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
      const response = await this.bigcommerce.getAllProducts({
        $,
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
      console.log(items.length, total, count, this.maxRequests);
    } while (items.length < total && count < this.maxRequests);

    $.export("$summary", "Successfully fetched all products");
    return items;
  },
};
