import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-earnings",
  name: "Get Earnings Calendar",
  description: "Get upcoming and historical earnings announcements and reports. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-calendar-earnings)",
  version: "0.0.2",
  type: "action",
  props: {
    mboum,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Get companies reporting earnings on the specified start date: YYYY-MM-DD",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Enter a calendar date. Format: YYYY-MM-DD",
    },
    priceMin: {
      type: "string",
      label: "Price Min",
      description: "Filter results by min price of the stock per share value",
      optional: true,
    },
    optionable: {
      type: "boolean",
      label: "Optionable",
      description: "Return only stocks with optionable contracts available",
      optional: true,
    },
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getEarnings({
      $,
      params: {
        start_date: this.startDate,
        end_date: this.endDate,
        price_min: this.priceMin,
        optionable: this.optionable,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved earnings calendar data");
    return response;
  },
};
