import monta from "../../monta.app.mjs";

export default {
  key: "monta-approve-inbound-forecasts",
  name: "Approve Inbound Forecasts",
  description: "Approve multiple inbound forecasts at once by their IDs. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1approve/post)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    monta,
    inboundForecastIds: {
      type: "integer[]",
      label: "Inbound Forecast IDs",
      description: "The IDs of the inbound forecasts to approve (e.g. `[123, 456]`). Obtained from **List Inbound Forecasts by Product SKU** or **Get Inbound Forecast Group** (the `InboundForecastId` field).",
    },
  },
  async run({ $ }) {
    const ids = this.inboundForecastIds.map(Number);
    const response = await this.monta.approveInboundForecasts({
      $,
      data: ids,
    });

    $.export("$summary", `Successfully approved ${ids.length} inbound forecast${ids.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
