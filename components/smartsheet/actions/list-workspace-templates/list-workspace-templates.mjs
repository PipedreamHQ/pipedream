// x-pd-ai: optimized
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
  version: "0.0.3",
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
      // Smartsheet has no "list all templates" endpoint, so every workspace's children
      // must be fetched. Fetch them concurrently rather than one workspace at a time —
      // sequential requests are what make this slow on the accounts where it matters.
      const perWorkspace = await Promise.all((workspaces || []).map((ws) =>
        this.smartsheet.listAllWorkspaceChildren(ws.id, {
          $,
          params: {
            childrenResourceTypes: "sheets,templates",
          },
        }).then(({ data }) => ({
          ws,
          children: data,
        }))));
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
