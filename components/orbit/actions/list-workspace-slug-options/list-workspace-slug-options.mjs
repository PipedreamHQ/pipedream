import orbit from "../../orbit.app.mjs";

export default {
  key: "orbit-list-workspace-slug-options",
  name: "List Workspace Slug Options",
  description: "Retrieves available options for the Workspace Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    orbit,
  },
  async run({ $ }) {
    const options = await orbit.propDefinitions.workspaceSlug.options.call(this.orbit);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
