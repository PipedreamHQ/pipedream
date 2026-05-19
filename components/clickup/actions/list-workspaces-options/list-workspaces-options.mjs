import clickup from "../../clickup.app.mjs";

export default {
  key: "clickup-list-workspaces-options",
  name: "List Workspace Options",
  description: "Retrieves available options for the Workspace field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clickup,
  },
  async run({ $ }) {
    const options = await clickup.propDefinitions.workspaces.options.call(this.clickup);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
