import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-templates",
  name: "List Workspace Templates",
  description:
    "Lists templates available in your workspaces, grouped with their workspace name."
    + " Use this to find template IDs for **New Sheet From Template**."
    + " Example: omit Workspace ID to scan all workspaces, or pass one (use **List Workspace Options** to find"
    + " workspace IDs) to scope the search — returns entries like"
    + " `{\"id\": \"1122334455667788\", \"name\": \"Project Plan\", \"workspaceId\": \"123...\", \"workspaceName\": \"Marketing\"}`."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "0.0.4",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    smartsheet,
    workspaceId: {
      propDefinition: [
        smartsheet,
        "workspaceId",
      ],
      description: "Optional. List templates from a specific workspace only. If omitted, lists templates from all workspaces.",
    },
  },
  async run({ $ }) {
    const templates = [];

    if (this.workspaceId) {
      const { data } = await this.smartsheet.listAllWorkspaceChildren(this.workspaceId, {
        $,
        params: {
          childrenResourceTypes: "sheets,templates",
        },
      });
      for (const child of data || []) {
        if (child.resourceType === "template") {
          templates.push({
            id: child.id,
            name: child.name,
            workspaceId: this.workspaceId,
          });
        }
      }
    } else {
      const { data: workspaces } = await this.smartsheet.listAllWorkspaces({
        $,
      });
      const childrenByWorkspace = await Promise.all((workspaces || []).map((ws) =>
        this.smartsheet.listAllWorkspaceChildren(ws.id, {
          $,
          params: {
            childrenResourceTypes: "sheets,templates",
          },
        }).then(({ data }) => ({
          ws,
          data,
        }))));
      for (const {
        ws, data: children,
      } of childrenByWorkspace) {
        for (const child of children || []) {
          if (child.resourceType === "template") {
            templates.push({
              id: child.id,
              name: child.name,
              workspaceId: ws.id,
              workspaceName: ws.name,
            });
          }
        }
      }
    }

    $.export("$summary", `Found ${templates.length} template${templates.length === 1
      ? ""
      : "s"}`);
    return templates;
  },
};
