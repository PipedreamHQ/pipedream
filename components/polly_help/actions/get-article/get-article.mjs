import pollyHelp from "../../polly_help.app.mjs";

export default {
  key: "polly_help-get-article",
  name: "Get Article",
  description: "Get an article. [See the documentation](https://docs.polly.help/integrations/a/publication-api-examples?partition=dHaktdqyY7Ce8DM72)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pollyHelp,
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The ID of the article to get. Use the **Search Publication** action to find an article ID.",
    },
  },
  async run({ $ }) {
    const response = await this.pollyHelp.getArticle({
      $,
      variables: {
        id: this.articleId,
      },
    });
    $.export("$summary", `Successfully retrieved article with ID ${this.articleId}`);
    return response;
  },
};
