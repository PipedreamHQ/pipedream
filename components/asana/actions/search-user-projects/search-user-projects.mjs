import asana from "../../asana.app.mjs";
import _ from "lodash";

export default {
  key: "asana-search-user-projects",
  name: "Get list of user projects",
  description: "Return list of projects given the user and workspace gid. [See the docs here](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.4.0",
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
    let projects = await this.asana.getProjects(this.workspace, {}, $);

    projects = projects.filter(async (project) => {
      project = await this.asana.getProject(project.gid);

      return project.members && !!_.find(project.members, {
        gid: this.user,
      });
    });

    $.export("$summary", "Successfully retrieved projects of user");

    return projects;
  },
};
