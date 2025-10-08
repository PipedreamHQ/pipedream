import wordpress from "../../wordpress_org.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "wordpress_org-create-post",
  name: "Create Post",
  description: "Creates a post. [See the documentation](https://developer.wordpress.org/rest-api/reference/posts/#create-a-post)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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

    const resp = await this.wordpress.createPost(params);

    $.export("$summary", "Successfully created new post.");

    return resp;
  },
};
