import joomla from "../../joomla.app.mjs";

export default {
  name: "Update Article",
  description: "Update an article",
  key: "joomla-update-article",
  version: "0.0.1",
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
    const params = {
      title: this.title,
      introtext: this.text,
    };
    const response = await this.joomla.updateArticle($, this.articleId, params);
    $.export("$summary", `Updated article ${response.data.attributes.title}`);
    return response;
  },
};
