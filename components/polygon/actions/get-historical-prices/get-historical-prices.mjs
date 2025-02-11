import polygon from "../../polygon.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygon-get-historical-prices",
  name: "Get Historical Prices",
  description: "Fetches historical price data for a specified stock ticker within a date range. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    polygon,
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    fromDate: {
      propDefinition: [
        polygon,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        polygon,
        "toDate",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.polygon.getHistoricalPriceData();
    $.export("$summary", `Fetched historical prices for ${this.stockTicker} from ${this.fromDate} to ${this.toDate}.`);
    return response;
  },
};
