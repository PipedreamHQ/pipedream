import { axios } from "@pipedream/platform";
import wordpress from "../../wordpress_org.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "wordpress_org-create-post",
  name: "Create Post",
  description: "Create a new WordPress post using the REST API directly. [See the documentation](https://developer.wordpress.org/rest-api/reference/posts/#create-a-post)",
  version: "0.0.6",
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
    excerpt: {
      propDefinition: [
        wordpress,
        "excerpt",
      ],
    },
    status: {
      type: "string",
      label: "Post Status",
      description: "Status of the post",
      optional: true,
      default: "publish",
      options: [
        "publish",
        "draft",
        "pending",
        "private",
      ],
    },
    commentStatus: {
      propDefinition: [
        wordpress,
        "commentStatus",
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
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Array of tag IDs to assign to the post",
      optional: true,
    },
    featuredMedia: {
      propDefinition: [
        wordpress,
        "media",
      ],
    },
    meta: {
      propDefinition: [
        wordpress,
        "meta",
      ],
    },
  },
  async run({ $ }) {
    // Prepare post data
    const postData = {
      title: this.title,
      content: this.content,
      status: this.status,
    };

    // Add optional fields if provided
    if (this.excerpt) {
      postData.excerpt = this.excerpt;
    }

    if (this.author) {
      postData.author = this.author;
    }

    if (this.commentStatus) {
      postData.comment_status = this.commentStatus;
    }

    if (this.categories && this.categories.length > 0) {
      postData.categories = Array.isArray(this.categories)
        ? this.categories.map((cat) => parseInt(cat))
        : this.categories;
    }

    if (this.tags && this.tags.length > 0) {
      postData.tags = Array.isArray(this.tags)
        ? this.tags.map((tag) => parseInt(tag))
        : this.tags;
    }

    if (this.featuredMedia) {
      postData.featured_media = parseInt(this.featuredMedia);
    }

    if (this.meta) {
      postData.meta = utils.parseObj(this.meta);
    }

    const response = await this.wordpress.createPost(postData);

    $.export("$summary", `Successfully created post: "${response.title.rendered}"`);

    return response;
  },
};
