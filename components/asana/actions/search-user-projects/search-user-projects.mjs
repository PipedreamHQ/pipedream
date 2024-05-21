import asana from "../../asana.app.mjs";
import _ from "lodash";

export default {
  key: "asana-search-user-projects",
  name: "Get list of user projects",
  description: "Return list of projects given the user and workspace gid. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.4.6",
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
      optional: true,
    },
    user: {
      label: "User",
      type: "string",
      description: "GID of a user",
      propDefinition: [
        asana,
        "users",
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
