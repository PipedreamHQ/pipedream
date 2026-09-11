import { mapWithConcurrency } from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-templates",
  name: "List Workspace Templates",
  description:
    "Lists the templates available across your workspaces, returning each template ID, name, and workspace."
    + " Use this to find a template ID for **New Sheet From Template**."
    + " When no workspace is set, a workspace that fails to traverse is skipped rather than failing the call,"
    + " so a successful response can be incomplete."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "0.0.5",
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
        "workspaceIdInput",
      ],
      description: "Scope the listing to one workspace. Smartsheet has no list-templates endpoint, so omitting this costs a workspace-list request plus one or more requests per workspace you can see; set it when you know where the template lives. Numeric workspace ID (e.g. `1234567890123456`). Use **List Workspace Options** to find one.",
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
      // No list-all-templates endpoint, so every workspace is walked; failures are skipped.
      const perWorkspace = await mapWithConcurrency(workspaces || [], async (ws) => {
        try {
          const { data } = await this.smartsheet.listAllWorkspaceChildren(ws.id, {
            $,
            params: {
              childrenResourceTypes: "sheets,templates",
            },
          });
          return {
            ws,
            children: data,
          };
        } catch {
          return {
            ws,
            children: [],
          };
        }
      });
      for (const {
        ws, children,
      } of perWorkspace) {
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
