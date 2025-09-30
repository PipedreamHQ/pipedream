import app from "../../elevio.app.mjs";

export default {
  key: "elevio-create-article",
  name: "Create Article",
  description: "Creates a new article in the Elevio knowledge base. [See the documentation](https://api-docs.elevio.help/en/articles/71-rest-api-articles).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    restriction: {
      propDefinition: [
        app,
        "restriction",
      ],
    },
    discoverable: {
      propDefinition: [
        app,
        "discoverable",
      ],
    },
    isInternal: {
      propDefinition: [
        app,
        "isInternal",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    status: {
      propDefinition: [
        app,
        "status",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    body: {
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
    createArticle(args = {}) {
      return this.app.post({
        path: "/articles",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createArticle,
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
    const response = await createArticle({
      $,
      data: {
        article: {
          external_id: externalId,
          restriction,
          discoverable,
          is_internal: isInternal,
          notes,
          status,
          category_id: categoryId,
          keywords,
          tags,
          translations: [
            {
              language_id: "en",
              title,
              body,
            },
          ],
        },
      },
    });

    $.export("$summary", `Successfully created article with ID \`${response.article.id}\`.`);
    return response;
  },
};
