import { EXPAND_SECTION_OPTIONS } from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import app from "../../onenote.app.mjs";

export default {
  name: "Search Sections",
  description: "Search and list OneNote sections across all notebooks. Use `search` for a case-insensitive name match (e.g. `meeting`) and `filter` for OData queries (e.g. `createdDateTime gt 2026-01-01T00:00:00Z`); they are combined with `and`. Returns each section with its `id`, `displayName` and parent notebook. Use the section `id` as `sectionId` in **Search Pages** or **Create Page**. [See the documentation](https://learn.microsoft.com/en-us/graph/api/onenote-list-sections?view=graph-rest-1.0&tabs=http)",
  key: "onenote-search-sections",
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
      description: "Free-text search against section names. Case-insensitive substring match, e.g. `meeting`. Translated server-side to a `contains` filter, because the OneNote API does not support `$search`.",
    },
    filter: {
      propDefinition: [
        app,
        "filter",
      ],
      description: "OData `$filter` expression for structured queries, e.g. `createdDateTime gt 2026-01-01T00:00:00Z` or `isDefault eq true`. Combined with `search` using `and` when both are set. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
    },
    expand: {
      propDefinition: [
        app,
        "expand",
      ],
      description: "Related resource to include inline in each section: `parentNotebook` or `parentSectionGroup`. Only one value is accepted.",
      options: EXPAND_SECTION_OPTIONS,
    },
  },
  async run({ $ }) {
    const { value: response } = await this.app.getSections({
      $,
      params: {
        "$filter": utils.buildSearchFilter({
          search: this.search,
          filter: this.filter,
        }),
        "$expand": this.expand,
      },
    });

    $.export("$summary", `Successfully found ${response.length} section${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
