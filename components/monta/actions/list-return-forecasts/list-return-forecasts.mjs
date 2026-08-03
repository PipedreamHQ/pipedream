// x-pd-ai: optimized
import monta from "../../monta.app.mjs";

export default {
  key: "monta-list-return-forecasts",
  name: "List Return Forecasts",
  description: "List the expected (forecasted) returns for an order, as opposed to the actual return records from **List Order Returns**. Use this to anticipate inbound returns before they physically arrive. [See the documentation](https://api-v6.monta.nl/index.html#tag/Order/paths/~1order~1%7Bwebshoporderid%7D~1returnforecasts/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    orderId: {
      propDefinition: [
        monta,
        "orderId",
      ],
    },
  },
  async run({ $ }) {
    const forecasts = await this.monta.listReturnForecasts({
      $,
      orderId: this.orderId,
    });

    $.export("$summary", `Successfully retrieved ${forecasts.length} return forecast${forecasts.length === 1
      ? ""
      : "s"} for order \`${this.orderId}\``);

    return forecasts;
  },
};
