import swagup from "../../swagup.app.mjs";

export default {
  key: "swagup-find-product-by-name",
  name: "Find Product by Name",
  description: "Search for a product by its name. [See docs here](https://support.swagup.com/en/articles/6757044-swagup-api-how-to-get-products-and-prices-from-swagup-catalog).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    swagup,
    query: {
      type: "string",
      label: "Query",
      description: "The query to filter on the product name",
    },
    category: {
      propDefinition: [
        swagup,
        "category",
      ],
      description: "A product category to filter on",
      optional: true,
    },
  },
  async run({ $ }) {
    const { results } = await this.swagup.listProducts({
      category: this.category,
    });
    const query = this.query.toLowerCase();
    const items = results.filter((product) => product.name.toLowerCase().includes(query));
    $.export("$summary", `Successfully found ${items.length} products`);
    return items;
  },
};
