import changesPage from "../../changes_page.app.mjs";

export default {
  key: "changes_page-get-post",
  name: "Get Post",
  description: "Get a post by ID from Changes Page. [See the documentation](https://docs.changes.page/docs/api/page#get-a-post-by-id)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    changesPage,
    postId: {
      propDefinition: [
        changesPage,
        "postId",
      ],
    },
  },
  async run({ $ }) {
    const post = await this.changesPage.getPost({
      $,
      postId: this.postId,
    });
    $.export("$summary", `Successfully retrieved post ${this.postId}`);
    return post;
  },
};
