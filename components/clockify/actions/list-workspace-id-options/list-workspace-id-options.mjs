import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-list-workspace-id-options",
  name: "List Workspace Options",
  description: "Lists the workspaces the authenticated user belongs to, as `{ label, value }` pairs where `value` is the workspace ID that every other Clockify action requires. Call this first when you don't already know which workspace to operate on. [See the documentation](https://docs.clockify.me/#tag/Workspace/operation/getWorkspacesOfUser)",
  version: "0.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clockify,
  },
  async run({ $ }) {
    const options = await clockify.propDefinitions.workspaceId.options.call(this.clockify);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
