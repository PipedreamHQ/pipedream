import polygon from "../../polygon.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "polygon-get-company-financials",
  name: "Get Company Financials",
  description: "Retrieves financial details for a specific company by stock ticker. [See the documentation](https://polygon.io/docs/stocks/get_v3_reference_financials).",
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
  },
  async run({ $ }) {
    const financialDetails = await this.polygon.getFinancialDetails();
    $.export("$summary", `Successfully retrieved financial details for ${this.stockTicker}`);
    return financialDetails;
  },
};
