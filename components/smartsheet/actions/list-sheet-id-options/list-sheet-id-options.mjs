import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-sheet-id-options",
  name: "List Sheet Options",
  description: "Retrieves available options for the Sheet field."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/list-sheets)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await smartsheet.propDefinitions.sheetId.options.call(this.smartsheet, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
