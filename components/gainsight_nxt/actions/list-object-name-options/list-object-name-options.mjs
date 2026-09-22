import gainsight_nxt from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-list-object-name-options",
  name: "List Custom Object Options",
  description: "Retrieves available options for the Custom Object field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gainsight_nxt,
  },
  async run({ $ }) {
    const options = await gainsight_nxt.propDefinitions.objectName.options.call(this.gainsight_nxt);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
