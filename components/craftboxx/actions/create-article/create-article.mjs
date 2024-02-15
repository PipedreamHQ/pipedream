import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-create-article",
  name: "Create Article",
  description: "Creates a new article in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    craftboxx,
    articleTitle: {
      propDefinition: [
        craftboxx,
        "articleTitle",
      ],
    },
    articleBody: {
      propDefinition: [
        craftboxx,
        "articleBody",
      ],
    },
    articleAuthor: {
      propDefinition: [
        craftboxx,
        "articleAuthor",
      ],
    },
    articleTags: {
      propDefinition: [
        craftboxx,
        "articleTags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.craftboxx.createArticle({
      title: this.articleTitle,
      body: this.articleBody,
      author: this.articleAuthor,
      tags: this.articleTags,
    });

    $.export("$summary", `Article titled '${this.articleTitle}' created successfully`);
    return response;
  },
};
