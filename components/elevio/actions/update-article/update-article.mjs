import app from "../../elevio.app.mjs";

export default {
  key: "elevio-update-article",
  name: "Update Article",
  description: "Updates an existing article in the Elevio knowledge base. [See the documentation](https://api-docs.elevio.help/en/articles/71-rest-api-articles).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    articleId: {
      propDefinition: [
        app,
        "articleId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    restriction: {
      optional: true,
      propDefinition: [
        app,
        "restriction",
      ],
    },
    discoverable: {
      optional: true,
      propDefinition: [
        app,
        "discoverable",
      ],
    },
    isInternal: {
      optional: true,
      propDefinition: [
        app,
        "isInternal",
      ],
    },
    notes: {
      optional: true,
      propDefinition: [
        app,
        "notes",
      ],
    },
    status: {
      optional: true,
      propDefinition: [
        app,
        "status",
      ],
    },
    title: {
      optional: true,
      propDefinition: [
        app,
        "title",
      ],
    },
    body: {
      optional: true,
      propDefinition: [
        app,
        "body",
      ],
    },
    keywords: {
      propDefinition: [
        app,
        "keywords",
      ],
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
    },
  },
  methods: {
    updateArticle({
      articleId, ...args
    } = {}) {
      return this.app.put({
        path: `/articles/${articleId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateArticle,
      articleId,
      externalId,
      restriction,
      discoverable,
      isInternal,
      notes,
      status,
      title,
      body,
      keywords,
      tags,
      categoryId,
    } = this;
    const response = await updateArticle({
      $,
      articleId,
      data: {
        article: {
          external_id: externalId,
          restriction,
          discoverable,
          is_internal: isInternal,
          notes,
          status,
          keywords,
          tags,
          category_id: categoryId,
          ...((title || body)
            ? {
              translations: [
                {
                  language_id: "en",
                  title,
                  body,
                },
              ],
            }
            : {}),
        },
      },
    });

    $.export("$summary", `Successfully updated article with ID \`${response.article.id}\`.`);
    return response;
  },
};
