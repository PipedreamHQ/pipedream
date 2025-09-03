import mboum from "../../mboum.app.mjs";

export default {
  key: "mboum-search",
  name: "Search Markets",
  description: "Search for stocks, ETFs, and other financial instruments. [See the documentation](https://docs.mboum.com/#stocks-options-small-stylecolor-f8f2f2background-fa256fpadding-1px-4pxborder-radius-3pxhotsmall-GETapi-v2-markets-search)",
  version: "0.0.1",
  type: "action",
  props: {
    mboum,
    search: {
      type: "string",
      label: "Search Query",
      description: "Search term for stocks, ETFs, or other financial instruments",
    },
  },
  async run({ $ }) {
    const response = await this.mboum.search({
      $,
      params: {
        search: this.search,
      },
    });

    $.export("$summary", `Successfully searched for "${this.search}"`);
    return response;
  },
};
