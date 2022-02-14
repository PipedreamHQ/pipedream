import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-issue",
  name: "Create issue",
  description: "Create an issue. See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.1",
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
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
  },
  async run({ $ }) {
    const {
      title,
      description,
      teamId,
      assigneeId,
    } = this;

    const response =
      await this.linearApp.createIssue({
        teamId,
        title,
        description,
        assigneeId,
      });

    if (response.success) {
      $.export("summary", `Created issue ${response._issue.id}`);
    } else {
      $.export("summary", "Failed to create issue");
    }

    return response;
  },
};
