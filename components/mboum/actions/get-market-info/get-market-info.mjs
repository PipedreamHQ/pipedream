import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-market-info",
  name: "Get Market Information",
  description: "Get comprehensive market information including indices, market status, and general market data. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-market-info)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
  },
  async run({ $ }) {
    const response = await this.mboum.getMarketInfo({
      $,
    });

    $.export("$summary", "Successfully retrieved market information");
    return response;
  },
};
