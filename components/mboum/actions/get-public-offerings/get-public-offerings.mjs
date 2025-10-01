import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-public-offerings",
  name: "Get Public Offerings",
  description: "Get data on public offerings including secondary offerings, SPAC mergers, and other capital market events. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-calendar-public_offerings)",
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
    const response = await this.mboum.getPublicOfferings({
      $,
      params: {
        date: this.date,
      },
    });

    $.export("$summary", "Successfully retrieved public offerings data");
    return response;
  },
};
