import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-comment",
  name: "Create Comment",
  description: "Create a comment in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
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
      description: "Filter issue selection by team",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
      description: "The issue to create the comment on",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the comment",
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createComment({
      issueId: this.issueId,
      body: this.body,
    });

    $.export("$summary", `Successfully created comment with ID ${response._comment.id}`);

    return response;
  },
};
