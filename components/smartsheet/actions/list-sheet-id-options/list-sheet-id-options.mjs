// x-pd-ai: optimized
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-sheet-id-options",
  name: "List Sheet Options",
  description: "Retrieves a single page of label/value pairs used to populate a Sheet dropdown field."
    + " This is a form helper, not a Smartsheet capability: it returns only names and IDs, one page at a time."
    + " Prefer **List Sheets**, which returns the same sheets with full metadata (owner, permalink, modified date)"
    + " and can fetch them all at once, or **Search** to find a sheet by name."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/sheets/list-sheets)",
  version: "1.0.0",
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
