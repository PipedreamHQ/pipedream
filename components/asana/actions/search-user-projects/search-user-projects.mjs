import asana from "../../asana.app.mjs";

export default {
  key: "asana-search-user-projects",
  name: "Get list of user projects",
  description: "Returns all projects in an Asana workspace where the specified user is a member. Omit `user` (or pass `\"me\"`) for the authenticated user's own projects — don't guess a GID from **List Users** when the request is about \"my\" projects. Results are workspace-wide and not scoped to any portfolio; archived projects may be included. If you need portfolio-scoped results, use **List Portfolios** and **List Portfolio Items** instead. Example: call with `workspace: '1200123456789012'` (no `user`) → returns `[{gid: '1204567890123456', name: 'Website Redesign'}, ...]` for projects the authenticated user is a member of. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.7.0",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "The workspace GID, e.g. `1201234567890123`. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    user: {
      label: "User",
      type: "string",
      description: "GID of a user, e.g. `1198765432109876`, or `\"me\"` for the authenticated user. Defaults to `\"me\"` if omitted. Use the **List Users** action to find another user's GID.",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
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
    // membership filtering below reads project.members, so always request the
    // base fields; merge in any user-requested opt_fields on top.
    const optFields = new Set([
      "gid",
      "name",
      "resource_type",
      "members",
    ]);
    if (Array.isArray(this.optFields)) {
      for (const field of this.optFields) {
        optFields.add(field);
      }
    }

    const userId = (!this.user || this.user === "me")
      ? (await this.asana.getUser({
        userId: "me",
        $,
      })).data.gid
      : this.user;

    let hasMore, count = 0;
    const params = {
      workspace: this.workspace,
      opt_fields: [
        ...optFields,
      ].join(","),
      limit: 100,
    };
    const allProjects = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getProjects({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const project of data) {
        const isMember = project.members && project.members.some((m) => m.gid === userId);
        if (!isMember) continue;
        allProjects.push(project);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", "Successfully retrieved projects of user");
    return allProjects;
  },
};
