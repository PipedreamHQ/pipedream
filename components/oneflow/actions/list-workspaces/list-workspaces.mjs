import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-list-workspaces",
  name: "List Workspaces",
  description: "List the workspaces in your Oneflow account."
    + " Use the `id` field with **List Contracts**, **List Templates** or **Create Contract**."
    + " [See the documentation](https://developer.oneflow.com/reference/get-workspaces)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userEmail: {
      propDefinition: [
        app,
        "userEmail",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const workspaces = await this.app.paginate({
      $,
      fn: this.app.listWorkspaces,
      userEmail: this.userEmail,
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${workspaces.length} workspace${workspaces.length === 1
      ? ""
      : "s"}`);
    return workspaces;
  },
};
