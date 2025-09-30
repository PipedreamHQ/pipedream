import zohoNotebook from "../../zoho_notebook.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zoho_notebook-list-notebooks",
  name: "List Notebooks",
  description: "Retrieve a list of all notebooks created by the user.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoNotebook,
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "Column to sort the results by. If not specified, last saved order is used to fetch the list",
      options: constants.SORT_COLUMNS,
      optional: true,
    },
    includeCoverImage: {
      type: "boolean",
      label: "Include Cover Image",
      description: "Whether to include the cover image in the results",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const items = this.zohoNotebook.paginate({
      resourceFn: this.zohoNotebook.listNotebooks,
      args: {
        $,
        params: {
          sort_column: this.sortColumn,
          include_cover_img: this.includeCoverImage,
        },
      },
      resourceType: "notebooks",
      max: this.maxResults,
    });

    const notebooks = [];
    for await (const item of items) {
      notebooks.push(item);
    }

    $.export("$summary", `Successfully listed ${notebooks.length} notebook${notebooks.length === 1
      ? ""
      : "s"}`);
    return notebooks;
  },
};
