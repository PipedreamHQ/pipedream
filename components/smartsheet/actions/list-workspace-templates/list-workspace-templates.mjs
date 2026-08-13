// x-pd-ai: optimized
import { mapWithConcurrency } from "../../common/utils.mjs";
import smartsheet from "../../smartsheet.app.mjs";

export default {
  key: "smartsheet-list-workspace-templates",
  name: "List Workspace Templates",
  description:
    "Lists the templates available across your workspaces, returning each template ID, name, and workspace."
    + " Use this to find a template ID for **New Sheet From Template**."
    + " Pass a Workspace ID to scope the search to one workspace; omit it to search them all."
    + " Smartsheet has no single list-templates endpoint, so omitting the workspace fans out across every"
    + " workspace you can see — scope it when you already know where the template lives."
    + " [See the documentation](https://developers.smartsheet.com/api/smartsheet/openapi/workspaces/get-workspace-children)",
  version: "1.0.0",
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
      // Smartsheet has no "list all templates" endpoint, so every workspace's children must
      // be fetched. Bounded concurrency: sequential was slow, unbounded fired one request
      // per workspace at once. A workspace that fails to traverse is skipped rather than
      // failing the whole listing.
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
