import gainsight_px from "../../gainsight_px.app.mjs";

export default {
  key: "gainsight_px-list-identify-id-options",
  name: "List Identify ID Options",
  description: "Retrieves available options for the Identify ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gainsight_px,
  },
  async run({ $ }) {
    const options = await gainsight_px.propDefinitions.identifyId.options.call(this.gainsight_px);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
