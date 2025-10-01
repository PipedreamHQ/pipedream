import app from "../../typeflo.app.mjs";

export default {
  key: "typeflo-create-post",
  name: "Create Post",
  description: "Creates and publish posts in yout blog. [See the documentation](https://typeflo.io/knowledge-base/headless-cms-admin-api-documentation#1-posts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    slug: {
      propDefinition: [
        app,
        "slug",
      ],
    },
    excerpt: {
      propDefinition: [
        app,
        "excerpt",
      ],
    },
    metatitle: {
      propDefinition: [
        app,
        "metatitle",
      ],
    },
    metadescription: {
      propDefinition: [
        app,
        "metadescription",
      ],
    },
    tocStatus: {
      propDefinition: [
        app,
        "tocStatus",
      ],
    },
    scheduled: {
      propDefinition: [
        app,
        "scheduled",
      ],
    },
    publishDate: {
      propDefinition: [
        app,
        "publishDate",
      ],
    },
    isDraft: {
      propDefinition: [
        app,
        "isDraft",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createPost({
      $,
      data: {
        postData: {
          title: this.title,
          content: this.content,
          slug: this.slug,
          excerpt: this.excerpt,
          metatitle: this.metatitle,
          metadescription: this.metadescription,
          toc_status: this.tocStatus,
          scheduled: this.scheduled,
          publish_date: this.publishDate,
          is_draft: this.isDraft,
        },
      },
    });
    $.export("$summary", "Successfully sent the request to create a post");
    return response;
  },
};
