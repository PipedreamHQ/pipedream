import app from "../../dotsimple.app.mjs";

export default {
  key: "dotsimple-delete-post",
  name: "Delete Post",
  description: "Remove a post from your DotSimple site. [See the documentation](https://help.dotsimple.io/en/articles/68-posts)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    postId: {
      propDefinition: [
        app,
        "postId",
      ],
    },
  },
  methods: {
    deletePost({
      postId, ...args
    } = {}) {
      return this.app.delete({
        path: `/posts/${postId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deletePost,
      postId,
    } = this;
    const response = await deletePost({
      $,
      postId,
    });
    $.export("$summary", "Successfully deleted post.");
    return response;
  },
};
