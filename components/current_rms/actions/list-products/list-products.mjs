import app from "../../current_rms.app.mjs";

export default {
  key: "current_rms-list-products",
  name: "List Products",
  description: "List products in Current RMS. Returns active products unless you set **Filter Mode**."
    + " [See the documentation](https://api.current-rms.com/doc#products-products-get)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Search name, product group name or tags, e.g. `Audio`.",
    },
    filterMode: {
      type: "string",
      label: "Filter Mode",
      description: "Which products to return, e.g. `all`. Defaults to active products.",
      options: [
        "active",
        "inactive",
        "all",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const products = await this.app.paginate({
      $,
      fn: this.app.listProducts,
      resourceKey: "products",
      maxResults: this.maxResults,
      params: {
        "filtermode": this.filterMode,
        "q[name_or_product_group_name_or_tags_name_cont]": this.search,
      },
    });
    $.export("$summary", `Found ${products.length} product${products.length === 1
      ? ""
      : "s"}`);
    return products;
  },
};
