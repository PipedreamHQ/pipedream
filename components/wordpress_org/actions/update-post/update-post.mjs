import wordpress from "../../wordpress_org.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "wordpress_org-update-post",
  name: "Update Post",
  description: "Updates a post specified by its ID. [See the documentation](https://developer.wordpress.org/rest-api/reference/posts/#update-a-post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    meta: {
      propDefinition: [
        wordpress,
        "meta",
      ],
    },
    media: {
      propDefinition: [
        wordpress,
        "media",
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
      meta: utils.parseObj(this.meta),
      featured_media: this.media,
    };

    const resp = await this.wordpress.updatePost(this.post, params);

    $.export("$summary", "Successfully updated post");

    return resp;
  },
};
