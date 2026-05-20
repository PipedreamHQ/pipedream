import orca_scan from "../../orca_scan.app.mjs";

export default {
  key: "orca_scan-list-sheet-id-options",
  name: "List Sheet ID Options",
  description: "Retrieves available options for the Sheet ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    orca_scan,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await orca_scan.propDefinitions.sheetId.options.call(this.orca_scan, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
