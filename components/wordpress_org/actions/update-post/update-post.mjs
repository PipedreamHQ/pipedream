import wordpress from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-update-post",
  name: "Update Post",
  description: "Updates a post specified by its ID. [See the docs here](https://developer.wordpress.org/rest-api/reference/posts/#update-a-post)",
  version: "0.0.1",
  type: "action",
  props: {
    wordpress,
    post: {
      propDefinition: [
        wordpress,
        "post",
      ],
    },
    title: {
      propDefinition: [
        wordpress,
        "title",
      ],
      optional: true,
    },
    content: {
      propDefinition: [
        wordpress,
        "content",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        wordpress,
        "status",
      ],
    },
    author: {
      propDefinition: [
        wordpress,
        "author",
      ],
    },
    categories: {
      propDefinition: [
        wordpress,
        "categories",
      ],
    },
    excerpt: {
      propDefinition: [
        wordpress,
        "excerpt",
      ],
    },
    commentStatus: {
      propDefinition: [
        wordpress,
        "commentStatus",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      title: this.title,
      content: this.content,
      status: this.status,
      author: this.author,
      categories: this.categories,
      excerpt: this.excerpt,
      comment_status: this.commentStatus,
    };

    const resp = await this.wordpress.updatePost(this.post, params);

    $.export("$summary", "Successfully updated post");

    return resp;
  },
};
