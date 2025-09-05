import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-options-flow",
  name: "Get Options Flow",
  description: "Get real-time options flow data showing large block trades and institutional activity. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-options-flow)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    type: {
      type: "string",
      label: "Type",
      description: "Type of options flow to retrieve",
      options: [
        "STOCKS",
        "ETFS",
        "INDICES",
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
    const response = await this.mboum.getOptionsFlow({
      $,
      params: {
        type: this.type,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved options flow data");
    return response;
  },
};
