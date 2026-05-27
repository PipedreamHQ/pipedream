import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-templates",
  name: "List Workspace Templates",
  description:
    "Lists templates available in your workspaces."
    + " Use this to find template IDs for **New Sheet From Template**."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "0.0.1",
  type: "action",
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
      const { data } = await this.smartsheet.listWorkspaceChildren(this.workspaceId, {
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
      for (const ws of workspaces || []) {
        const { data: children } = await this.smartsheet.listWorkspaceChildren(ws.id, {
          $,
          params: {
            childrenResourceTypes: "sheets,templates",
          },
        });
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
