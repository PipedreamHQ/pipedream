import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-product-stock-changes",
  name: "List Product Stock Changes",
  description:
    "List products whose stock changed since a specified date and time. [See the documentation](https://api-v6.monta.nl/index.html#tag/Product/paths/~1product~1updated_since~1%7BupdatedSince%7D/get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description:
        "The start date and time in ISO 8601 format (eg. `2026-07-24T00:00:00Z`). Monta accepts a maximum lookback of 7 days.",
    },
  },
  async run({ $ }) {
    const response = await this.monta.listProductStockChanges({
      $,
      updatedSince: this.updatedSince,
    });
    const products = response.Products ?? [];
    const productLabel = products.length === 1
      ? "product"
      : "products";

    $.export("$summary", `Successfully retrieved ${products.length} ${productLabel} with stock changes.`);

    return products;
  },
};
