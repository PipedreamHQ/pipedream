import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-delete-post",
  name: "Delete Post",
  description: "Removes a page or blog post from Confluence by its ID. Use with caution, the action is irreversible.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    confluence,
    postType: {
      propDefinition: [
        confluence,
        "postType",
      ],
    },
    postId: {
      propDefinition: [
        confluence,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.confluence.deletePost({
      postType: this.postType,
      postId: this.postId,
    });
    $.export("$summary", `Post with ID ${this.postId} was successfully deleted.`);
    return response;
  },
};
