import wordpress from "../../wordpress_org.app.mjs";

export default {
  key: "wordpress_org-create-post",
  name: "Create Post",
  description: "Creates a post. [See the docs here](https://developer.wordpress.org/rest-api/reference/posts/#create-a-post)",
  version: "0.0.1",
  type: "action",
  props: {
    wordpress,
    title: {
      propDefinition: [
        wordpress,
        "title",
      ],
    },
    content: {
      propDefinition: [
        wordpress,
        "content",
      ],
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

    const resp = await this.wordpress.createPost(params);

    $.export("$summary", "Successfully created new post.");

    return resp;
  },
};
