import linearApp from "../../linear_app.app.mjs";

export default {
  type: "action",
  key: "linear_app-create-issue",
  name: "Create Issue",
  description: "Creates a new issue in Linear. Requires team ID and title. Optional: description, assignee, project, state. Returns response object with success status and issue details. Uses API Key authentication. [See the documentation]](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues).",
  version: "0.4.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
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
    title: {
      propDefinition: [
        linearApp,
        "issueTitle",
      ],
    },
    description: {
      propDefinition: [
        linearApp,
        "issueDescription",
      ],
    },
    assigneeId: {
      propDefinition: [
        linearApp,
        "assigneeId",
      ],
    },
    stateId: {
      propDefinition: [
        linearApp,
        "stateId",
        ({ teamId }) => ({
          teamId,
        }),
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
  },
  async run({ $ }) {
    const {
      linearApp,
      projectId,
      title,
      description,
      teamId,
      assigneeId,
      stateId,
      labelIds,
    } = this;

    const response =
      await linearApp.createIssue({
        teamId,
        projectId,
        title,
        description,
        assigneeId,
        stateId,
        labelIds,
      });

    const summary = response.success
      ? `Created issue ${response._issue.id}`
      : "Failed to create issue";
    $.export("$summary", summary);

    return response;
  },
};
