import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-get-issue",
  name: "Get Issue",
  description: "Get an issue by ID (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api)",
  version: "0.1.8",
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
