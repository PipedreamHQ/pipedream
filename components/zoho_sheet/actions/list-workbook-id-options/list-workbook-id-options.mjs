import zoho_sheet from "../../zoho_sheet.app.mjs";

export default {
  key: "zoho_sheet-list-workbook-id-options",
  name: "List Worksheet Options",
  description: "Retrieves available options for the Worksheet field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zoho_sheet,
  },
  async run({ $ }) {
    const options = await zoho_sheet.propDefinitions.workbookId.options.call(this.zoho_sheet);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
