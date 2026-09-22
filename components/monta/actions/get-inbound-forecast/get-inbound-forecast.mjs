import monta from "../../monta.app.mjs";

export default {
  key: "monta-get-inbound-forecast",
  name: "Get Inbound Forecast",
  description: "Retrieve a single inbound forecast from a group by reference and SKU. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1%7Breference%7D~1%7Bsku%7D/get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    reference: {
      propDefinition: [
        monta,
        "reference",
      ],
    },
    sku: {
      propDefinition: [
        monta,
        "sku",
      ],
      description: "The product SKU of the forecast to retrieve",
    },
  },
  async run({ $ }) {
    const response = await this.monta.getInboundForecast({
      $,
      reference: this.reference,
      sku: this.sku,
    });

    $.export("$summary", `Successfully retrieved inbound forecast for SKU \`${this.sku}\` in group \`${this.reference}\``);

    return response;
  },
};
