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
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let hasMore, count = 0;
    const params = {
      workspace: this.workspace,
      limit: 100,
      opt_fields: "gid,name,resource_type,members",
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
