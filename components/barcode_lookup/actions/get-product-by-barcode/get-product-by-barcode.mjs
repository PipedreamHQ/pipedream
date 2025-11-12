import app from "../../barcode_lookup.app.mjs";

export default {
  key: "barcode_lookup-get-product-by-barcode",
  name: "Get Product by Barcode",
  description: "Get a product by barcode. [See the documentation](https://www.barcodelookup.com/api-documentation)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    barcode: {
      type: "string",
      label: "Barcode",
      description: "The barcode to search for. You can also use a partial barcode (6 digits minimum) followed by an asterisk (*).",
    },
  },
  async run({ $ }) {
    const response = await this.app.getProducts({
      $,
      params: {
        barcode: this.barcode,
      },
    });
    $.export("$summary", "Successfully retrieved product by barcode");
    return response;
  },
};
