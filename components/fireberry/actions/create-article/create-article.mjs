import fireberry from "../../fireberry.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "fireberry-create-article",
  name: "Create an Article",
  description: "Creates a new article in Fireberry. [See the documentation](https://developers.fireberry.com/reference/create-an-article)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireberry,
    articleName: {
      propDefinition: [
        fireberry,
        "articleName",
      ],
    },
    articleSubject: {
      propDefinition: [
        fireberry,
        "articleSubject",
      ],
    },
    articleBody: {
      propDefinition: [
        fireberry,
        "articleBody",
      ],
    },
    description: {
      propDefinition: [
        fireberry,
        "description",
      ],
    },
    ownerId: {
      propDefinition: [
        fireberry,
        "ownerId",
      ],
    },
    stateCode: {
      propDefinition: [
        fireberry,
        "stateCode",
      ],
    },
    statusCode: {
      propDefinition: [
        fireberry,
        "statusCode",
      ],
    },
    viewCount: {
      propDefinition: [
        fireberry,
        "viewCount",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fireberry.createArticle({
      articleName: this.articleName,
      articleSubject: this.articleSubject,
      articleBody: this.articleBody,
      description: this.description,
      ownerId: this.ownerId,
      stateCode: this.stateCode,
      statusCode: this.statusCode,
      viewCount: this.viewCount,
    });

    $.export("$summary", `Successfully created the article '${this.articleName}'`);
    return response;
  },
};
