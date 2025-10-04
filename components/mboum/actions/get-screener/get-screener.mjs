import mboum from "../../mboum.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mboum-get-screener",
  name: "Get Stock Screener Results",
  description: "Screen stocks based on various financial criteria and filters. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-screener)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    metricType: {
      type: "string",
      label: "Metric Type",
      description: "Type of metric to use for screening",
      options: [
        "overview",
        "technical",
        "performance",
        "fundamental",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter to apply to the screener. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-screener) for more information about screeners",
      options: constants.SCREENER_FILTERS,
    },
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getScreener({
      $,
      params: {
        metricType: this.metricType,
        filter: this.filter,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully screened stocks");
    return response;
  },
};
