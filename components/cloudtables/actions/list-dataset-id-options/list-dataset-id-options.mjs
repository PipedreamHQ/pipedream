import cloudtables from "../../cloudtables.app.mjs";

export default {
  key: "cloudtables-list-dataset-id-options",
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
    cloudtables,
  },
  async run({ $ }) {
    const options = await cloudtables.propDefinitions.datasetID.options.call(this.cloudtables);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
