import _ from "lodash";
import asana from "../../asana.app.mjs";

export default {
  key: "asana-search-user-projects",
  name: "Get My Projects",
  description: "Returns projects for the currently authenticated user (my projects, assigned to me) in a given workspace. Can also retrieve projects for any specified user. [See the documentation](https://developers.asana.com/docs/get-multiple-projects)",
  version: "0.5.6",
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
      description: "The user whose projects to retrieve. Defaults to the currently authenticated user (me).",
      optional: true,
      default: "me",
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
    let userGid = this.user;
    if (!userGid || userGid === "me") {
      const { data: me } = await this.asana.getUser({
        userId: "me",
        $,
      });
      userGid = me.gid;
    }

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
        gid: userGid,
      });
    });

    $.export("$summary", "Successfully retrieved projects of user");

    return projects;
  },
};
