import { EXPAND_NOTEBOOK_OPTIONS } from "../../common/constants.mjs";
import app from "../../onenote.app.mjs";

export default {
  name: "Search Notebooks",
  description: "Searches for notebooks. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-notebooks?view=graph-rest-1.0&tabs=http)",
  key: "onenote-search-notebooks",
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
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      options: EXPAND_NOTEBOOK_OPTIONS,
    },
  },
  async run({ $ }) {
    const { value: response } = await this.app.getNotebooks({
      $,
      params: {
        "$search": this.search,
        "$filter": this.filter,
        "$expand": this.expand,
      },
    });

    $.export("$summary", `Successfully found ${response.length} notebook${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
