import { EXPAND_NOTEBOOK_OPTIONS } from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import app from "../../onenote.app.mjs";

export default {
  name: "Search Notebooks",
  description: "Search and list OneNote notebooks. Use `search` for a case-insensitive name match (e.g. `project`) and `filter` for OData queries (e.g. `isDefault eq true`); they are combined with `and`. Returns each notebook with its `id`, `displayName` and links. Use the `id` with **Search Sections** or **Create Section** to work inside a notebook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-notebooks?view=graph-rest-1.0&tabs=http)",
  key: "onenote-search-notebooks",
  type: "action",
  ai: "optimized",
  version: "0.0.3",
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
      description: "Related resource to include inline in each notebook: `sections` or `sectionGroups`. Only one value is accepted.",
      options: EXPAND_NOTEBOOK_OPTIONS,
    },
  },
  async run({ $ }) {
    const { value: response } = await this.app.getNotebooks({
      $,
      params: {
        "$filter": utils.buildSearchFilter({
          search: this.search,
          filter: this.filter,
        }),
        "$expand": this.expand,
      },
    });

    $.export("$summary", `Successfully found ${response.length} notebook${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
