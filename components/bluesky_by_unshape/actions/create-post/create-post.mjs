import bluesky_by_unshape from "../../bluesky_by_unshape.app.mjs";

export default {
  key: "bluesky_by_unshape-create-post",
  name: "Create Post",
  description: "Creates a new post in Bluesky. [See the documentation](https://unshape.readme.io/reference/post_bluesky-create-post)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bluesky_by_unshape,
    content: {
      type: "string",
      label: "Content",
      description: "The body of the post",
    },
    author: {
      type: "string",
      label: "Author",
      description: "The creator of the post",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the post",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags associated with the post",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bluesky_by_unshape.createPost({
      content: this.content,
      author: this.author,
      title: this.title,
      tags: this.tags,
    });
    $.export("$summary", `Created post with title ${this.title}`);
    return response;
  },
};
