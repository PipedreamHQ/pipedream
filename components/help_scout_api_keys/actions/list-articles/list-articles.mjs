import helpscout from "../../help_scout_api_keys.app.mjs";

export default {
  key: "help_scout_api_keys-list-articles",
  name: "List Articles",
  description: "Retrieve a list of articles by collection or category. [See the documentation](https://developer.helpscout.com/docs-api/articles/list/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    helpscout,
    collectionId: {
      propDefinition: [
        helpscout,
        "collectionId",
      ],
    },
    categoryId: {
      propDefinition: [
        helpscout,
        "categoryId",
        ({ collectionId }) => ({
          collectionId,
        }),
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        helpscout,
        "status",
      ],
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The field to sort the articles by",
      options: [
        "number",
        "status",
        "name",
        "popularity",
        "createdAt",
        "updatedAt",
      ],
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "The order to sort the articles by",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    page: {
      propDefinition: [
        helpscout,
        "page",
      ],
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of articles to retrieve per page",
      optional: true,
      default: 100,
      max: 100,
    },
  },
  async run({ $ }) {
    const params = {
      status: this.status,
      sort: this.sort,
      order: this.order,
      page: this.page,
      pageSize: this.pageSize,
    };
    const response = this.categoryId
      ? await this.helpscout.listArticlesByCategory({
        $,
        categoryId: this.categoryId,
        params,
      })
      : await this.helpscout.listArticlesByCollection({
        $,
        collectionId: this.collectionId,
        params,
      });
    $.export("$summary", `Retrieved ${response.articles.items.length} article${response.articles.items.length === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
