import _ from "lodash";
import asana from "../../asana.app.mjs";

export default {
  key: "asana-search-user-projects",
  name: "Get list of user projects",
  description: "Return list of projects given the user and workspace gid. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.5.4",
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
      description: "Gid of a workspace.",
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
  },
  async run({ $ }) {
    let { data: projects } = await this.asana.getProjects({
      params: {
        workspace: this.workspace,
      },
      $,
    });

    projects = projects.filter(async (project) => {
      const { data } = await this.asana.getProject({
        projectId: project.gid,
        $,
      });

      return data.members && !!_.find(data.members, {
        gid: this.user,
      });
    });

    $.export("$summary", "Successfully retrieved projects of user");

    return projects;
  },
};
