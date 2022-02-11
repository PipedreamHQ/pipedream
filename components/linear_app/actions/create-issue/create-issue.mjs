import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-issue",
  name: "Create issue",
  description: "Create an issue. See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.1",
  props: {
    linearApp,
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
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
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

    $.export("summary", `Created issue ${response.id}`);

    return response;
  },
};
