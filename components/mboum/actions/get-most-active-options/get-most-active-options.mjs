import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-get-most-active-options",
  name: "Get Most Active Options",
  description: "Get the most actively traded options contracts based on volume and trading activity. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v1-markets-options-most-active)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mboum,
    type: {
      type: "string",
      label: "Type",
      description: "Type of most active options to retrieve",
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
    const response = await this.mboum.getMostActive({
      $,
      params: {
        type: this.type,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully retrieved most active options");
    return response;
  },
};
