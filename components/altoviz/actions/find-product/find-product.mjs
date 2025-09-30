import altoviz from "../../altoviz.app.mjs";

export default {
  key: "altoviz-find-product",
  name: "Find Product",
  description: "Finds products in Altoviz using the 'productnumber' prop. [See the documentation](https://developer.altoviz.com/api#tag/Products/operation/GET_Products_Find)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    altoviz,
    productNumber: {
      type: "string",
      label: "Product Number",
      description: "The number of the product",
    },
  },
  async run({ $ }) {
    const response = await this.altoviz.findProduct({
      $,
      params: {
        number: this.productNumber,
      },
    });
    if (response?.length) {
      $.export("$summary", `Successfully found ${response.length} product${response.length === 1
        ? ""
        : "s"}`);
    }
    return response;
  },
};
