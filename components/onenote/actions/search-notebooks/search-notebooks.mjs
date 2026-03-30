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
      type: "string",
      label: "Search",
      description: "Search for notebooks. [See the documentation](https://learn.microsoft.com/en-us/graph/search-query-parameter?tabs=http)",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filter for notebooks. [See the documentation](https://learn.microsoft.com/en-us/graph/query-parameters?tabs=http#filter)",
      optional: true,
    },
    expand: {
      type: "string",
      label: "Expand",
      description: "Expand the response",
      optional: true,
      options: [
        "sections",
        "sectionGroups",
      ],
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
