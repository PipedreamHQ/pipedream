import channable from "../../channable.app.mjs";

export default {
  key: "channable-update-stock-update",
  name: "Update Stock Update",
  description: "Update a stock update for a company and project. [See the documentation](https://api.channable.com/v1/docs#tag/stock_updates/operation/stock_updates_update_companies__company_id__projects__project_id__stock_updates_post)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    channable,
    stockUpdateId: {
      propDefinition: [
        channable,
        "stockUpdateId",
      ],
    },
    stock: {
      type: "integer",
      label: "Stock",
      description: "Whole new stock value for the item, not a delta",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the stock update",
    },
    gtin: {
      type: "string",
      label: "GTIN",
      description: "The GTIN of the item",
    },
  },
  async run({ $ }) {
    const response = await this.channable.updateStockUpdate({
      $,
      data: [
        {
          id: this.stockUpdateId,
          stock: this.stock,
          title: this.title,
          gtin: this.gtin,
        },
      ],
    });
    $.export("$summary", `Updated stock update ${this.stockUpdateId}`);
    return response;
  },
};
