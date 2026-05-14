import dust from "../../dust.app.mjs";

export default {
  key: "dust-list-data-source-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available options for the Folder ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dust,
  },
  async run({ $ }) {
    const options = await dust.propDefinitions.dataSourceId.options.call(this.dust);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
