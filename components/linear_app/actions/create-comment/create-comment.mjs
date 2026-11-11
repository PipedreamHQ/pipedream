import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-create-comment",
  name: "Create Comment",
  description: "Adds a markdown comment to a Linear issue. Use it to comment on an issue; to comment on a Linear document, use **Create Document Comment** instead. Use **Search Issues** to find the target issue ID first. Returns the new comment's `id`, `body` and `url`, plus the issue's `id`, `identifier` and `url`. Example: `issueId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"`, `body: \"Fixed in PR #123.\"` → returns `{success: true, comment: {id: \"5c3b1f0e-0000-0000-0000-000000000009\", body: \"Fixed in PR #123.\", url: \"https://linear.app/acme/issue/ENG-42/fix-login-redirect-on-mobile#comment-5c3b1f0e\", issue: {identifier: \"ENG-42\"}}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=comment)",
  version: "1.0.3",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
      ],
      description: "The issue to create the comment on (a UUID, e.g. `7df5e7f9-a357-4539-ae94-4a004fec635f`). Use **Search Issues** to find issues and retrieve their IDs.",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The content of the comment in markdown format. Example: `Fixed in PR #123. Let me know if you need any further changes.`",
    },
  },
  async run({ $ }) {
    const response = await this.linearApp.createComment({
      $,
      input: {
        issueId: this.issueId,
        body: this.body,
      },
    });

    $.export("$summary", `Commented on issue ${response.comment.issue.identifier}: ${response.comment.url}`);

    return response;
  },
};
