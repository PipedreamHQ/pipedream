import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-issue",
  name: "Get Issue",
  description: "Retrieves a Linear issue by its ID. Returns complete issue details including title, description, state, assignee, team, project, labels, and timestamps. Uses API Key authentication. See Linear docs for additional info [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api).",
  version: "0.1.10",
  type: "action",
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The issue ID",
    },
  },
  async run({ $ }) {
    const {
      linearApp,
      issueId,
    } = this;

    const issue = await linearApp.getIssue({
      issueId,
    });
    $.export("$summary", `Found issue with ID ${issueId}`);
    return issue;
  },
};
