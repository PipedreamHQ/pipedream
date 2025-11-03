import { TYPES } from "../../common/constants.mjs";
import eodhdApis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-search-stock-symbol",
  name: "Search Stock Symbol",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find stock symbols using company names or partial symbols. [See the docs here](https://eodhistoricaldata.com/financial-apis/search-api-for-stocks-etfs-mutual-funds-and-indices/)",
  type: "action",
  props: {
    eodhdApis,
    query: {
      type: "string",
      label: "Query",
      description: "Could be any string with a ticker code or company name. Examples: `AAPL`, `Apple Inc`, `Apple`. You can also use ISINs for the search: US0378331005. There are no limitations to a minimum number of symbols in the query string.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of results should be returned with the query. Default value: 15. If the limit is higher than 50, it will be automatically reset to 50.",
      optional: true,
    },
    bondsOnly: {
      type: "boolean",
      label: "Bonds Only",
      description: "The default value is False and search returns only tickers, ETFs, and funds. To get bonds in result use value True.",
      optional: true,
    },
    exchangeCode: {
      propDefinition: [
        eodhdApis,
        "exchangeCode",
      ],
      description: "Filters output by exchange. Allowed input is the exchange code.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The default value is `all`. You can specify the type of asset you search for. Please note: with the value `all` bonds will not be displayed, you should explicitly request bonds.",
      optional: true,
      options: TYPES,
    },
  },
  async run({ $ }) {

    const {
      eodhdApis,
      query,
      bondsOnly,
      exchangeCode,
      ...params
    } = this;

    const response = await eodhdApis.searchStockSymbol({
      $,
      query,
      params: {
        bonds_only: bondsOnly,
        exchange: exchangeCode,
        ...params,
      },
    });

    const length = response.length;

    $.export("$summary", `${length} stock symbol${length > 1
      ? "s were"
      : " was"} successfully fetched!`);

    return response;
  },
};
