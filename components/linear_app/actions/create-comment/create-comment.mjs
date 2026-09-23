import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-comment",
  name: "Create Comment",
  description: "Add a comment to a Linear issue. Use **Search Issues** to find the target issue ID first. Returns the new comment's ID and body. Example: `issueId: \"iss_01abc\"`, `body: \"Fixed in PR #123.\"` → returns `{success: true, comment: {id: \"cmt_xyz\", body: \"Fixed in PR #123.\"}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "0.0.5",
  type: "action",
  ai: "optimized",
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
      description: "Filter issue selection by team. Use **Get Teams** to discover valid team IDs.",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The issue to create the comment on",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The content of the comment in markdown format. Example: `Fixed in PR #123. Let me know if you need any further changes.`",
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createComment({
      issueId: this.issueId,
      body: this.body,
    });

    if (response?._comment) {
      $.export("$summary", `Successfully created comment with ID ${response._comment.id}`);
    }

    return response;
  },
};
