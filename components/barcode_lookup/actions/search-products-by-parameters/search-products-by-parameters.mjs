import app from "../../barcode_lookup.app.mjs";

export default {
  key: "barcode_lookup-search-products-by-parameters",
  name: "Search Products by Parameters",
  description: "Search for products by parameters. [See the documentation](https://www.barcodelookup.com/api-documentation)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    mpn: {
      type: "string",
      label: "MPN",
      description: "MPN parameter is the manufacturer part number. `E.g. **LXCF9407**`",
      optional: true,
    },
    asin: {
      type: "string",
      label: "ASIN",
      description: "ASIN parameter is the Amazon Standard Identification Number. `E.g. **B079L4WR4T**`",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Search by product name (title) for any item. `E.g. **Red Running Shoes**`",
      optional: true,
    },
    category: {
      type: "string",
      label: "Category",
      description: "Search by category - based on [Google's product taxonomy](https://www.google.com/basepages/producttype/taxonomy.en-US.txt). `E.g. **Home & Garden > Decor**`",
      optional: true,
    },
    manufacturer: {
      type: "string",
      label: "Manufacturer",
      description: "search by manufacturer - use double quotes (\"\") around value for an exact match. `E.g. **\"Samsung\"**`",
      optional: true,
    },
    brand: {
      type: "string",
      label: "Brand",
      description: "Search by brand - use double quotes (\"\") around value for an exact match. `E.g. **\"Calvin Klein\"**`",
      optional: true,
    },
    search: {
      type: "string",
      label: "Search",
      description: "Query all the search fields including title, category, brand and MPN. `E.g. **\"Air Jordan Red Shoes Size 40\"**`",
      optional: true,
    },
    geo: {
      type: "string",
      label: "Geo",
      description: "Filter online store results by geographical location",
      options: [
        "us",
        "gb",
        "ca",
        "eu",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.app.paginate({
        $,
        fn: this.app.getProducts,
        maxResults: this.maxResults,
        params: {
          mpn: this.mpn,
          asin: this.asin,
          title: this.title,
          category: this.category,
          manufacturer: this.manufacturer,
          brand: this.brand,
          search: this.search,
          metadata: "y",
          geo: this.geo,
          formatted: "y",
        },
      });

      const responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      $.export("$summary", `Successfully retrieved ${responseArray.length} products`);
      return responseArray;
    } catch (error) {
      $.export("$summary", "Successfully retrieved 0 products");
      return [];
    }
  },
};
