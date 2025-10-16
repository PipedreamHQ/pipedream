import {
  SORT_HISTORICAL_OPTIONS,
  SORT_OPTIONS, TIMEFRAME_OPTIONS,
} from "../../common/constants.mjs";
import polygon from "../../polygon.app.mjs";

export default {
  key: "polygon-get-company-financials",
  name: "Get Company Financials",
  description: "Retrieves financial details for a specific company by stock ticker. [See the documentation](https://polygon.io/docs/stocks/get_vx_reference_financials).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    polygon,
    stockTicker: {
      propDefinition: [
        polygon,
        "stockTicker",
      ],
    },
    filingDate: {
      type: "string",
      label: "Filing Date",
      description: "Query by the date when the filing with financials data was filed in **YYYY-MM-DD** format.",
      optional: true,
    },
    periodOfReportDate: {
      type: "string",
      label: "Period Of Report Date",
      description: "The period of report for the filing with financials data in **YYYY-MM-DD** format.",
      optional: true,
    },
    timeframe: {
      type: "string",
      label: "Timeframe",
      description: "Query by timeframe. Annual financials originate from 10-K filings, and quarterly financials originate from 10-Q filings. Note: Most companies do not file quarterly reports for Q4 and instead include those financials in their annual report, so some companies my not return quarterly financials for Q4",
      options: TIMEFRAME_OPTIONS,
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Order results based on the `Sort` field.",
      options: SORT_OPTIONS,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of results returned.",
      optional: true,
      min: 1,
      max: 100,
      default: 10,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort field used for ordering",
      options: SORT_HISTORICAL_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const financialDetails = await this.polygon.getFinancialDetails({
      $,
      params: {
        ticker: this.stockTicker,
        filing_date: this.filingDate,
        period_of_report_date: this.periodOfReportDate,
        timeframe: this.timeframe,
        order: this.order,
        limit: this.limit,
        sort: this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved financial details for ${this.stockTicker}`);
    return financialDetails;
  },
};
