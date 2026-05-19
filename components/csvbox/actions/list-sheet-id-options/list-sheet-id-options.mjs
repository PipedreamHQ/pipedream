import csvbox from "../../csvbox.app.mjs";

export default {
  key: "csvbox-list-sheet-id-options",
  name: "List Sheet Options",
  description: "Retrieves available options for the Sheet field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    csvbox,
  },
  async run({ $ }) {
    const options = await csvbox.propDefinitions.sheetId.options.call(this.csvbox);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
