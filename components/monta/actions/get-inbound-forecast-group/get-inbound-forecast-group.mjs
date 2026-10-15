import monta from "../../monta.app.mjs";

export default {
  key: "monta-get-inbound-forecast-group",
  name: "Get Inbound Forecast Group",
  description: "Retrieve an inbound forecast group and its forecasts by reference. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group~1%7Breference%7D/get)",
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
  },
  async run({ $ }) {
    const response = await this.monta.getInboundForecastGroup({
      $,
      reference: this.reference,
    });

    $.export("$summary", `Successfully retrieved inbound forecast group \`${this.reference}\``);

    return response;
  },
};
