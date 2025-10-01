import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-economic-events",
  name: "Get Economic Events",
  description: "Get upcoming and historical economic events and indicators that can impact market movements. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-calendar-economic_events)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    const response = await this.mboum.getEconomicEvents({
      $,
      params: {
        date: this.date,
      },
    });

    $.export("$summary", "Successfully retrieved economic events");
    return response;
  },
};
