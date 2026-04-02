import egnyte from "../../egnyte.app.mjs";

export default {
  key: "egnyte-search",
  name: "Search",
  description: "Search for files and folders in your Egnyte workspace. [See the documentation](https://developers.egnyte.com/api-docs/read/search-api)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    egnyte,
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for",
    },
    folder: {
      propDefinition: [
        egnyte,
        "folderPath",
      ],
      description: "Limit the result set to only items contained in the specified folder and all of its descendants. Search for a folder to select or enter a folder path manually.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Limit the result set to only items of the specified type(s)",
      optional: true,
      options: [
        "FILE",
        "FOLDER",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of results to skip for pagination",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "The maximum number of results to return",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the results by",
      optional: true,
      options: [
        "last_modified",
        "size",
        "name",
        "score",
      ],
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "The direction to sort the results by",
      optional: true,
      options: [
        "ascending",
        "descending",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.egnyte.search({
      $,
      params: {
        query: this.query,
        folder: this.folder,
        type: this.type,
        offset: this.offset,
        count: this.count,
        sort_by: this.sortBy,
        sort_direction: this.sortDirection,
      },
    });
    $.export("$summary", `Successfully searched for "${this.query}" and found ${response.results?.length || 0} result${response.results?.length != 1
      ? "s"
      : ""}.`);
    return response;
  },
};
