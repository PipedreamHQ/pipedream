import paigo from "../../paigo.app.mjs";

export default {
  key: "paigo-list-dimension-id-options",
  name: "List Dimension ID Options",
  description: "Retrieves available options for the Dimension ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    paigo,
  },
  async run({ $ }) {
    const options = await paigo.propDefinitions.dimensionId.options.call(this.paigo, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
