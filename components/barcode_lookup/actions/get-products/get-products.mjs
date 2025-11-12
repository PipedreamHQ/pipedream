import app from "../../barcode_lookup.app.mjs";

export default {
  key: "barcode_lookup-get-products",
  name: "Get Products",
  description: "Retrieve products details by barcode, MPN, ASIN, or search terms. [See the documentation](https://www.barcodelookup.com/api-documentation#endpoints)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    barcode: {
      propDefinition: [
        app,
        "barcode",
      ],
    },
    mpn: {
      propDefinition: [
        app,
        "mpn",
      ],
    },
    asin: {
      propDefinition: [
        app,
        "asin",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
    manufacturer: {
      propDefinition: [
        app,
        "manufacturer",
      ],
    },
    brand: {
      propDefinition: [
        app,
        "brand",
      ],
    },
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getProducts({
      $,
      params: {
        barcode: this.barcode,
        mpn: this.mpn,
        asin: this.asin,
        title: this.title,
        category: this.category,
        manufacturer: this.manufacturer,
        brand: this.brand,
        search: this.search,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.products.length + " products");
    return response;
  },
};
