import joomla from "../../joomla.app.mjs";

export default {
  name: "Create Article",
  description: "Create an article. See the docs [here](https://docs.joomla.org/J4.x:Joomla_Core_APIs#Create_Article)",
  key: "joomla-create-article",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joomla,
    title: {
      propDefinition: [
        joomla,
        "title",
      ],
    },
    text: {
      propDefinition: [
        joomla,
        "text",
      ],
    },
    categoryId: {
      propDefinition: [
        joomla,
        "categoryId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.joomla.createArticle({
      $,
      data: {
        title: this.title,
        articletext: this.text,
        catid: this.categoryId,
        language: "*",
      },
    });
    $.export("$summary", `Created article ${response.data.attributes.title}`);
    return response;
  },
};
