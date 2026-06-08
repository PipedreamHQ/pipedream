import asana from "../../asana.app.mjs";

export default {
  key: "asana-search-user-projects",
  name: "Get list of user projects",
  description: "Return list of projects given the user and workspace gid. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.5.7",
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
      description: "The workspace GID. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    user: {
      label: "User",
      type: "string",
      description: "GID of a user",
      propDefinition: [
        asana,
        "users",
        ({ workspace }) => ({
          workspace,
        }),
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
        const isMember = project.members && project.members.some((m) => m.gid === this.user);
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
