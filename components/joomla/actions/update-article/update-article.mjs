import joomla from "../../joomla.app.mjs";

export default {
  name: "Update Article",
  description: "Update an article. See the docs [here](https://docs.joomla.org/J4.x:Joomla_Core_APIs#Update_Article)",
  key: "joomla-update-article",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joomla,
    articleId: {
      propDefinition: [
        joomla,
        "articleId",
      ],
    },
    title: {
      propDefinition: [
        joomla,
        "title",
      ],
      optional: true,
    },
    text: {
      propDefinition: [
        joomla,
        "text",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.joomla.updateArticle({
      $,
      id: this.articleId,
      data: {
        title: this.title,
        introtext: this.text,
      },
    });
    $.export("$summary", `Updated article ${response.data.attributes.title}`);
    return response;
  },
};
