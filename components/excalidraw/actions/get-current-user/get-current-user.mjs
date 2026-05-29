import app from "../../excalidraw.app.mjs";

export default {
  key: "excalidraw-get-current-user",
  name: "Get Current User",
  description:
    "Returns the current workspace context from Excalidraw Plus, including workspace ID, name, user IDs, and roles."
    + " Use this when the user asks 'who am I', 'what workspace am I in', or needs the workspace ID or user role."
    + " [See the documentation](https://plus.excalidraw.com/docs/api/workspace/workspaces-get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const workspace = await this.app.getWorkspace($);
    $.export("$summary", `Workspace: ${workspace.name} (${workspace.id})`);
    return workspace;
  },
};
