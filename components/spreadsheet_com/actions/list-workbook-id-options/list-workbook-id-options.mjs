import spreadsheet_com from "../../spreadsheet_com.app.mjs";

export default {
  key: "spreadsheet_com-list-workbook-id-options",
  name: "List Workbook Id Options",
  description: "Retrieves available options for the Workbook Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    spreadsheet_com,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await spreadsheet_com.propDefinitions.workbookId.options
      .call(this.spreadsheet_com, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
