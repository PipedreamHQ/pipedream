import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-dividends",
  name: "Get Dividends Calendar",
  description: "Get upcoming and historical dividend payments and ex-dividend dates. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-calendar-dividends)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    date: {
      propDefinition: [
        mboum,
        "date",
      ],
    },
    page: {
      propDefinition: [
        mboum,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.mboum.getDividends({
      $,
      params: {
        date: this.date,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved dividends calendar data");
    return response;
  },
};
