import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-ipo-data",
  name: "Get IPO Data",
  description: "Get upcoming and recent Initial Public Offering (IPO) data including dates, prices, and company information. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-calendar-ipo)",
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
  },
  async run({ $ }) {
    const response = await this.mboum.getIpoData({
      $,
      params: {
        date: this.date,
      },
    });

    $.export("$summary", "Successfully retrieved IPO data");
    return response;
  },
};
