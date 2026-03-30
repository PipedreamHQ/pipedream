import { EXPAND_SECTION_OPTIONS } from "../../common/constants.mjs";
import app from "../../onenote.app.mjs";

export default {
  name: "Search Sections",
  description: "Searches for sections. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-sections?view=graph-rest-1.0&tabs=http)",
  key: "onenote-search-sections",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Search for sections. [See the documentation](https://learn.microsoft.com/en-us/graph/search-query-parameter?tabs=http)",
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "Filter for sections. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      options: EXPAND_SECTION_OPTIONS,
    },
  },
  async run({ $ }) {
    const { value: response } = await this.app.getSections({
      $,
      params: {
        "$search": this.search,
        "$filter": this.filter,
        "$expand": this.expand,
      },
    });

    $.export("$summary", `Successfully found ${response.length} section${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
