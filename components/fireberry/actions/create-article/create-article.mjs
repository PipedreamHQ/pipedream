import app from "../../fireberry.app.mjs";

export default {
  key: "fireberry-create-article",
  name: "Create an Article",
  description: "Creates a new article in Fireberry. [See the documentation](https://developers.fireberry.com/reference/create-an-article)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    articleName: {
      propDefinition: [
        app,
        "articleName",
      ],
    },
    articleSubject: {
      propDefinition: [
        app,
        "articleSubject",
      ],
    },
    articleBody: {
      propDefinition: [
        app,
        "articleBody",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createArticle({
      $,
      data: {
        articlename: this.articleName,
        articlesubject: this.articleSubject,
        articlebody: this.articleBody,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully created the article '${this.articleName}'`);
    return response;
  },
};
