import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-list-templates",
  name: "List Templates",
  description: "List the contract templates available to you, optionally in one workspace."
    + " Use the `id` field with **Create Contract**."
    + " [See the documentation](https://developer.oneflow.com/reference/get-templates)",
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
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
        ({ userEmail }) => ({
          userEmail,
        }),
      ],
      description: "Only return templates in this workspace, e.g. `12345`. Use **List Workspaces** to find it (the `id` field).",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const templates = await this.app.paginate({
      $,
      fn: this.app.listTemplates,
      userEmail: this.userEmail,
      maxResults: this.maxResults,
      params: {
        "filter[workspace_ids]": this.workspaceId,
      },
    });
    $.export("$summary", `Found ${templates.length} template${templates.length === 1
      ? ""
      : "s"}`);
    return templates;
  },
};
