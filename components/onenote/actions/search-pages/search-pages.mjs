import { EXPAND_PAGE_OPTIONS } from "../../common/constants.mjs";
import app from "../../onenote.app.mjs";

export default {
  name: "Search Pages",
  description: "Searches for pages. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-pages?view=graph-rest-1.0&tabs=http)",
  key: "onenote-search-pages",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "Filter for pages. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      options: EXPAND_PAGE_OPTIONS,
    },
  },
  async run({ $ }) {
    const { value: response } = await this.app.getPages({
      $,
      params: {
        "$search": this.search,
        "$filter": this.filter,
        "$expand": this.expand,
      },
    });

    $.export("$summary", `Successfully found ${response.length} page${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
