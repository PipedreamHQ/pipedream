import asana from "../../asana.app.mjs";

export default {
  type: "action",
  key: "asana-search-projects",
  version: "0.3.4",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Search Projects",
  description: "Finds projects across an entire Asana workspace, optionally filtered by name (e.g. `Website Redesign`). Results are workspace-wide and are not limited to any portfolio, and there is no due-date filter. Archived projects are included unless you set `archived: false`. Every result includes `workspace.gid` — reuse that value directly for the `workspace` param on a follow-up action like **Create Task**, no need to look it up separately. If you need portfolio-scoped results, use **List Portfolios** and **List Portfolio Items** instead. Example: call with `workspace: '1200123456789012'`, `name: 'Marketing'` → returns `[{gid: '1204567890123456', name: 'Q4 Marketing Campaign', workspace: {gid: '1200123456789012'}}, ...]`. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  props: {
    asana,
    name: {
      label: "Name",
      description: "The name to filter projects on (client-side substring match), e.g. `Website Redesign`.",
      type: "string",
      optional: true,
    },
    workspace: {
      propDefinition: [
        asana,
        "workspaces",
      ],
      label: "Workspace",
      description: "The workspace or organization GID to filter projects on, e.g. `1201234567890123`. Use the **List Workspaces** action to find available workspace GIDs. If omitted, projects across all accessible workspaces are returned.",
      type: "string",
      optional: true,
    },
    archived: {
      label: "Archived",
      description: "Only return projects whose `archived` field matches this value. Set to `false` to exclude archived projects; if omitted, both archived and non-archived projects are returned. Example: `false`.",
      type: "boolean",
      optional: true,
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional project properties to include in the response (e.g. `created_at`, `start_on`, `due_on`, `archived`, `custom_fields`). Nested paths are allowed; `gid` is always returned.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
      description: "Maximum number of projects to return (min 1, max 9999), e.g. `100`.",
    },
  },
  async run({ $ }) {
    const optFields = Array.isArray(this.optFields)
      ? [
        ...this.optFields,
      ]
      : [];
    if (this.name && optFields.length && !optFields.includes("name")) {
      // the name filter below needs project.name present in the response
      optFields.push("name");
    }

    // Asana's GET /projects now rejects requests with no workspace/team scope
    // (the "cross_workspace_deprecation" change), so a workspace-less search
    // has to fan out across every accessible workspace internally instead of
    // sending one unscoped request. getWorkspaces() itself is paginated, so
    // walk every page rather than just the first.
    let workspaces;
    if (this.workspace) {
      workspaces = [
        this.workspace,
      ];
    } else {
      workspaces = [];
      const params = {};
      let hasMoreWorkspaces;
      do {
        const {
          data, next_page: next,
        } = await this.asana.getWorkspaces({
          params,
          $,
        });
        workspaces.push(...data.map(({ gid }) => gid));
        hasMoreWorkspaces = next;
        params.offset = next?.offset;
      } while (hasMoreWorkspaces);
    }

    let count = 0;
    const results = [];

    for (const workspace of workspaces) {
      if (count >= this.maxResults) {
        break;
      }

      let hasMore;
      const params = {
        workspace,
        archived: this.archived,
        opt_fields: optFields.length
          ? optFields.join(",")
          : undefined,
        limit: 100,
      };

      do {
        const {
          data, next_page: next,
        } = await this.asana.getProjects({
          params,
          $,
        });

        hasMore = next;
        params.offset = next?.offset;

        if (!data?.length) break;

        for (const project of data) {
          if (this.name && !project.name?.includes(this.name)) continue;
          // The workspace fan-out above already knows which workspace this project
          // came from — attach it so callers chaining into another action (e.g.
          // Create Task) don't have to guess or re-query for it.
          results.push({
            ...project,
            workspace: project.workspace ?? {
              gid: workspace,
              resource_type: "workspace",
            },
          });
          if (++count >= this.maxResults) {
            hasMore = false;
            break;
          }
        }
      } while (hasMore);
    }

    $.export("$summary", "Successfully retrieved projects");
    return results;
  },
};
