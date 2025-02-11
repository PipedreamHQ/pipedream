import polygon from "../../polygon.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygon-get-stock-price",
  name: "Get Stock Price",
  description: "Retrieves the current price of a specified stock ticker. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    polygon,
    stockTicker: {
      propDefinition: [
        "polygon",
        "stockTicker",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.polygon.getCurrentPrice();
    const currentPrice = response?.tickers?.[0]?.lastTrade?.p;

    $.export("$summary", `Current price of ${this.stockTicker} is $${currentPrice}`);
    return response;
  },
};
