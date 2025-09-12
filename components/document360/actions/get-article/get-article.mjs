import app from "../../document360.app.mjs";

export default {
  key: "document360-get-article",
  name: "Get Article",
  description: "Gets an article from Document360. [See the documentation](https://apidocs.document360.com/apidocs/get-article)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectVersionId: {
      propDefinition: [
        app,
        "projectVersionId",
      ],
    },
    articleId: {
      propDefinition: [
        app,
        "articleId",
        ({ projectVersionId }) => ({
          projectVersionId,
        }),
      ],
    },
    langCode: {
      propDefinition: [
        app,
        "langCode",
        ({ projectVersionId }) => ({
          projectVersionId,
        }),
      ],
      default: "en",
    },
    isForDisplay: {
      type: "boolean",
      label: "Is For Display",
      description: "Set this to `true`, if you are displaying the article to the end-user. If `, the content of snippets or variables appears in the article. Note: If the value is true, ensure that the article content is not passed for update article endpoints.",
      optional: true,
    },
    isPublished: {
      type: "boolean",
      label: "Is Published",
      description: "`true` : You will get the latest published version of the article. (If there are no published versions, then it will return the latest version) `false` : To get the the latest version of the article",
      optional: true,
    },
    appendSASToken: {
      type: "boolean",
      label: "Append SAS Token",
      description: "Set this to `false` to exclude appending SAS token for images/files",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      articleId,
      langCode,
      isForDisplay,
      isPublished,
      appendSASToken,
    } = this;

    const response = await app.getArticle({
      $,
      articleId,
      langCode,
      params: {
        isForDisplay,
        isPublished,
        appendSASToken,
      },
    });

    $.export("$summary", `Successfully retrieved article ID \`${articleId}\` (${langCode})`);
    return response;
  },
};
