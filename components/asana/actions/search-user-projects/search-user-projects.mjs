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
      limit: Math.min(this.maxResults, 100),
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

      const membership = [];
      for (let i = 0; i < data.length; i += 50) {
        const chunk = data.slice(i, i + 50);
        const results = await Promise.all(
          chunk.map(async (project) => {
            const { data: detail } = await this.asana.getProject({
              projectId: project.gid,
              $,
            });
            const isMember = detail.members && detail.members.some((m) => m.gid === this.user);
            return isMember
              ? project
              : null;
          }),
        );
        membership.push(...results);
      }

      for (const project of membership) {
        if (!project) continue;
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
