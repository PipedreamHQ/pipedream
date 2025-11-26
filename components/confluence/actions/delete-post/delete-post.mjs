import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-delete-post",
  name: "Delete Post",
  description: "Removes a blog post from Confluence by its ID. Use with caution, the action is irreversible. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v2/api-group-blog-post/#api-blogposts-id-delete)",
  version: "0.0.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    confluence,
    postId: {
      propDefinition: [
        confluence,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.confluence.deletePost({
      $,
      cloudId: await this.confluence.getCloudId({
        $,
      }),
      postId: this.postId,
    });
    $.export("$summary", `Post with ID ${this.postId} was successfully deleted.`);
    return response;
  },
};
