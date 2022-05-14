import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update Issue",
  description: "Update an issue (API Key). See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.2",
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
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
    teamId: {
      optional: true,
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
      issueId,
      title,
      description,
      teamId,
      assigneeId,
    } = this;

    const response =
      await this.linearApp.updateIssue({
        issueId,
        input: {
          teamId,
          title,
          description,
          assigneeId,
        },
      });

    if (response.success) {
      $.export("summary", `Updated issue ${response._issue.id}`);
    } else {
      $.export("summary", "Failed to update issue");
    }

    return response;
  },
};
