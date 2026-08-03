// x-pd-ai: optimized
import monta from "../../monta.app.mjs";

export default {
  key: "monta-delete-inbound-forecast-group",
  name: "Delete Inbound Forecast Group",
  description: "Delete an inbound forecast group, or a single SKU within it when a SKU is provided. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1%7Breference%7D/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    reference: {
      propDefinition: [
        monta,
        "reference",
      ],
      description: "The reference of the inbound forecast group to delete. Use the **List Inbound Forecast Groups** action to find available references.",
    },
    sku: {
      propDefinition: [
        monta,
        "sku",
      ],
      description: "If provided, only the forecast for this SKU is deleted instead of the entire group",
      optional: true,
    },
  },
  async run({ $ }) {
    await this.monta.deleteInboundForecastGroup({
      $,
      reference: this.reference,
      params: {
        sku: this.sku,
      },
    });

    $.export("$summary", this.sku
      ? `Successfully deleted SKU \`${this.sku}\` from inbound forecast group \`${this.reference}\``
      : `Successfully deleted inbound forecast group \`${this.reference}\``);

    return {
      success: true,
    };
  },
};
