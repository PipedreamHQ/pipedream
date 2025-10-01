import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update Issue",
  description: "Updates an existing Linear issue. Can modify title, description, assignee, state, project, team, labels, priority, and dates. Returns updated issue details. Uses API Key authentication. See Linear docs for additional info [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues).",
  type: "action",
  version: "0.1.13",
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
  },
  async run({ $ }) {
    const {
      issueId,
      title,
      description,
      teamIdToUpdate,
      stateId,
      assigneeId,
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
        },
      });

    const summary = response.success
      ? `Updated issue ${response._issue.id}`
      : "Failed to update issue";
    $.export("$summary", summary);

    return response;
  },
};
