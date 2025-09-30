import eodhdApis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-retrieve-stock-prices",
  name: "Retrieve Stock Prices",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Fetch historical stock prices for a given symbol and time period. [See the docs here](https://eodhistoricaldata.com/financial-apis/api-for-historical-data-and-volumes/)",
  type: "action",
  props: {
    eodhdApis,
    exchangeCode: {
      propDefinition: [
        eodhdApis,
        "exchangeCode",
      ],
    },
    symbolCode: {
      propDefinition: [
        eodhdApis,
        "symbolCode",
        ({ exchangeCode }) => ({
          exchangeCode,
        }),
      ],
    },
    fmt: {
      propDefinition: [
        eodhdApis,
        "fmt",
      ],
    },
    period: {
      propDefinition: [
        eodhdApis,
        "period",
      ],
      optional: true,
    },
    order: {
      propDefinition: [
        eodhdApis,
        "order",
      ],
      optional: true,
    },
    from: {
      propDefinition: [
        eodhdApis,
        "from",
      ],
      optional: true,
    },
    to: {
      propDefinition: [
        eodhdApis,
        "to",
      ],
      optional: true,
    },
  },
  async run({ $ }) {

    const {
      eodhdApis,
      exchangeCode,
      symbolCode,
      ...params
    } = this;

    const response = await eodhdApis.retrieveStockPrices({
      $,
      path: `${symbolCode}.${exchangeCode}`,
      params,
    });

    $.export("$summary", `The historical stock price of ${symbolCode}.${exchangeCode} was successfully fetched!`);
    return response;
  },
};
