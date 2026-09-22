import autodesk from "../../autodesk.app.mjs";

export default {
  key: "autodesk-list-hub-id-options",
  name: "List Hub ID Options",
  description: "Retrieves available options for the Hub ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    autodesk,
  },
  async run({ $ }) {
    const options = await autodesk.propDefinitions.hubId.options.call(this.autodesk);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
