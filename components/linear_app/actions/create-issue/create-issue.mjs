import linearApp from "../../linear_app.app.mjs";

export default {
  type: "action",
  key: "linear_app-create-issue",
  name: "Create Issue",
  description: "Create an issue (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  version: "0.4.8",
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
    } = this;

    const response =
      await linearApp.createIssue({
        teamId,
        projectId,
        title,
        description,
        assigneeId,
        stateId,
      });

    const summary = response.success
      ? `Created issue ${response._issue.id}`
      : "Failed to create issue";
    $.export("$summary", summary);

    return response;
  },
};
