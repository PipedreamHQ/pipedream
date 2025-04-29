import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update Issue",
  description: "Update an issue (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.1.8",
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
