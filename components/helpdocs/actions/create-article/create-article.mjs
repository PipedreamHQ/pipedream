import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-create-article",
  name: "Create Article",
  description: "Create a new article in your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/8Y2t6NVxeU-creating-an-article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpdocs,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
    },
    categoryId: {
      propDefinition: [
        helpdocs,
        "categoryId",
      ],
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the article",
      optional: true,
    },
    isPrivate: {
      type: "boolean",
      label: "Is Private",
      description: "Whether the article is private",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "Whether the article is published",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the article",
      optional: true,
    },
    shortVersion: {
      type: "string",
      label: "Short Version",
      description: "The short version of the article",
      optional: true,
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "The slug of the article",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags of the article",
      optional: true,
    },
    multilingual: {
      type: "string[]",
      label: "Multilingual",
      description: "The language code(s) of the article (e.g. `en`, `fr`, etc.)",
      optional: true,
    },
  },
  async run({ $ }) {
    const { article } = await this.helpdocs.createArticle({
      $,
      data: {
        title: this.title,
        category_id: this.categoryId,
        body: this.body,
        is_private: this.isPrivate,
        is_published: this.isPublished,
        description: this.description,
        short_version: this.shortVersion,
        slug: this.slug,
        tags: this.tags,
        multilingual: this.multilingual,
      },
    });

    $.export("$summary", `Created article ${this.title}`);
    return article;
  },
};
