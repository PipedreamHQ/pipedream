import eodhdApis from "../../eodhd_apis.app.mjs";

export default {
  key: "eodhd_apis-get-company-financials",
  name: "Get Company Financials",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Obtain financial statements for a specific company. [See the docs here](https://eodhistoricaldata.com/financial-apis/stock-etfs-fundamental-data-feeds/)",
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
  },
  async run({ $ }) {

    const {
      eodhdApis,
      exchangeCode,
      symbolCode,
    } = this;

    const response = await eodhdApis.getCompanyFinantials({
      $,
      path: `${symbolCode}.${exchangeCode}`,
    });

    $.export("$summary", `The Financial Statements of ${symbolCode}.${exchangeCode} was successfully fetched!`);
    return response;
  },
};
