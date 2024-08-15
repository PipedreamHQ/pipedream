import app from "../../dropinblog.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "dropinblog-create-post",
  name: "Create Post",
  description: "Allows you to create a new blog post in your DropInBlog account. Requires a private API key. [See the documentation](https://dropinblog.readme.io/reference/posts-create).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    content: {
      propDefinition: [
        app,
        "content",
      ],
    },
    seoTitle: {
      type: "string",
      label: "SEO Title",
      description: "SEO title for your post. If not set it will default to the title.",
      optional: true,
    },
    seoDescription: {
      type: "string",
      label: "SEO Description",
      description: "SEO description for your post.",
      optional: true,
    },
    keyword: {
      type: "string",
      label: "Keyword",
      description: "SEO keyword for your post.",
      optional: true,
    },
    publishedAt: {
      type: "string",
      label: "Published At",
      description: "Published date and time for your post. If set the post will be published. If not set the post will be put in draft. Eg: `2021-01-01T00:00:00Z`",
      optional: true,
    },
    featuredImage: {
      type: "string",
      label: "Featured Image",
      description: "Featured image URL for your post.",
      optional: true,
    },
    categoryIds: {
      type: "integer[]",
      description: "Category IDs to attach to your post.",
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    authorId: {
      propDefinition: [
        app,
        "authorId",
      ],
    },
  },
  methods: {
    createPost(args = {}) {
      return this.app.post({
        path: "/posts",
        headers: {
          usePrivateApiKey: true,
        },
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createPost,
      title,
      content,
      seoTitle,
      seoDescription,
      keyword,
      publishedAt,
      featuredImage,
      categoryIds,
      authorId,
    } = this;

    const response = await createPost({
      $,
      data: {
        title,
        content,
        seo_title: seoTitle,
        seo_description: seoDescription,
        keyword,
        published_at: publishedAt,
        featured_image: featuredImage,
        category_ids: utils.parseArray(categoryIds),
        author_id: authorId,
      },
    });

    $.export("$summary", `Successfully created a new blog post with ID \`${response.data.post.id}\``);
    return response;
  },
};
