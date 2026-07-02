import geckoboard from "../../geckoboard.app.mjs";

export default {
  key: "geckoboard-list-dataset-id-options",
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
    geckoboard,
  },
  async run({ $ }) {
    const options = await geckoboard.propDefinitions.datasetId.options.call(this.geckoboard, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
