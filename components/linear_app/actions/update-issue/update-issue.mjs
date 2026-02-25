import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update Issue",
  description: "Updates an existing Linear issue. Can modify title, description, assignee, state, project, team, labels, priority, and dates. Returns updated issue details. Uses API Key authentication. [See the documentation](https://linear.app/developers/graphql#creating-and-editing-issues).",
  type: "action",
  version: "0.1.16",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    teamId: {
      label: "Current Team",
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    title: {
      optional: true,
      propDefinition: [
        linearApp,
        "issueTitle",
      ],
    },
    description: {
      optional: true,
      propDefinition: [
        linearApp,
        "issueDescription",
      ],
    },
    teamIdToUpdate: {
      description: "The identifier or key of the team to update the issue to",
      optional: true,
      propDefinition: [
        linearApp,
        "teamId",
      ],
    },
    stateId: {
      propDefinition: [
        linearApp,
        "stateId",
        ({
          teamId, teamIdToUpdate,
        }) => ({
          teamId: teamIdToUpdate || teamId,
        }),
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    labelIds: {
      propDefinition: [
        linearApp,
        "issueLabels",
        () => ({
          byId: true,
        }),
      ],
    },
    projectId: {
      propDefinition: [
        linearApp,
        "projectId",
        ({ teamId }) => ({
          teamId,
        }),
      ],
    },
    priority: {
      propDefinition: [
        linearApp,
        "issuePriority",
      ],
    },
  },
  async run({ $ }) {
    const {
      issueId,
      title,
      description,
      teamIdToUpdate,
      stateId,
      assigneeId,
      labelIds,
      projectId,
      priority,
    } = this;

    const response =
      await this.linearApp.updateIssue({
        issueId,
        input: {
          teamId: teamIdToUpdate,
          title,
          description,
          assigneeId,
          stateId,
          labelIds,
          projectId,
          priority,
        },
      });

    const summary = response.success
      ? `Updated issue ${response._issue.id}`
      : "Failed to update issue";
    $.export("$summary", summary);

    return response;
  },
};
