import app from "../../elevio.app.mjs";

export default {
  key: "elevio-delete-article",
  name: "Delete Article",
  description: "Deletes an existing article from the Elevio knowledge base. [See the documentation](https://api-docs.elevio.help/en/articles/71-rest-api-articles).",
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
  },
  methods: {
    deleteArticle({
      articleId, ...args
    }) {
      return this.app.delete({
        path: `/articles/${articleId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteArticle,
      articleId,
    } = this;

    const response = await deleteArticle({
      $,
      articleId,
    });
    $.export("$summary", "Successfully deleted article.");
    return response;
  },
};
