import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-update-issue",
  name: "Update issue",
  description: "Update an issue. See the docs [here](https://developers.linear.app/docs/graphql/working-with-the-graphql-api#creating-and-editing-issues)",
  type: "action",
  version: "0.0.1",
  props: {
    linearApp,
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
      await this.linearApp.updateIssue({
        teamId,
        title,
        description,
        assigneeId,
      });

    $.export("summary", `Updated issue ${response.id}`);

    return response;
  },
};
