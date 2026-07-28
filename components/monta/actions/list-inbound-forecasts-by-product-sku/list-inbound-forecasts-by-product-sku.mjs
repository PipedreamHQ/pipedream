import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-inbound-forecasts-by-product-sku",
  name: "List Inbound Forecasts by Product SKU",
  description: "List all inbound forecasts for a given product SKU across groups. Use this to check expected incoming stock for a SKU. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1byproductsku~1%7Bproductsku%7D/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    productSku: {
      type: "string",
      label: "Product SKU",
      description: "The product SKU to list inbound forecasts for",
    },
  },
  async run({ $ }) {
    const forecasts = await this.monta.listInboundForecastsByProductSku({
      $,
      productSku: this.productSku,
    });

    $.export("$summary", `Successfully retrieved ${forecasts.length} inbound forecast${forecasts.length === 1
      ? ""
      : "s"} for SKU \`${this.productSku}\``);

    return forecasts;
  },
};
