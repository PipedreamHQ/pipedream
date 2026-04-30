import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-list-project-members",
  name: "List Project Members",
  description: "List all members of a project. [See the documentation](https://docs.gitlab.com/api/project_members/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: "Filters results based on a given name, email, or username. Use partial values to widen the scope of the query.",
      optional: true,
    },
    userIds: {
      propDefinition: [
        gitlab,
        "assignee",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string[]",
      label: "User IDs",
      description: "Filter results to specific GitLab user IDs. Example: `[\"123\", \"456\"]`.",
      optional: true,
    },
    skipUsers: {
      propDefinition: [
        gitlab,
        "assignee",
        ({ projectId }) => ({
          projectId,
        }),
      ],
      type: "string[]",
      label: "Skip Users",
      description: "Exclude specific GitLab user IDs from results. Example: `[\"123\", \"456\"]`.",
      optional: true,
    },
    showSeatInfo: {
      type: "boolean",
      label: "Show Seat Info",
      description: "Return seat information for each member if available.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.listProjectMembers(this.projectId, {
      $,
      params: {
        query: this.query,
        user_ids: this.userIds,
        skip_users: this.skipUsers,
        show_seat_info: this.showSeatInfo,
      },
    });
    $.export("$summary", `Successfully fetched ${response.length} project members`);
    return response;
  },
};
