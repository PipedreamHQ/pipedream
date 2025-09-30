import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-highest-iv-options",
  name: "Get Highest IV Options",
  description: "Get options contracts with the highest Implied Volatility (IV) levels for volatility trading strategies. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-highest-iv)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort options by",
      options: [
        "HIGHEST",
        "LOWEST",
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
    const response = await this.mboum.getHighestIv({
      $,
      params: {
        sort: this.sort,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved highest IV options");
    return response;
  },
};
