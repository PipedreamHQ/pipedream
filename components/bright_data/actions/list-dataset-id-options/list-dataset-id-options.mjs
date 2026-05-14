import bright_data from "../../bright_data.app.mjs";

export default {
  key: "bright_data-list-dataset-id-options",
  name: "List Dataset ID Options",
  description: "Retrieves available options for the Dataset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bright_data,
  },
  async run({ $ }) {
    const options = await bright_data.propDefinitions.datasetId.options.call(this.bright_data);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
