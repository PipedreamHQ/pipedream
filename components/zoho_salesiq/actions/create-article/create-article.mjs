import zohoSalesIQ from "../../zoho_salesiq.app.mjs";

export default {
  key: "zoho_salesiq-create-article",
  name: "Create Article",
  description: "Create a new article. [See the documentation](https://www.zoho.com/salesiq/help/developer-section/create-articles-v2.html)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zohoSalesIQ,
    screenName: {
      propDefinition: [
        zohoSalesIQ,
        "screenName",
      ],
    },
    departmentId: {
      propDefinition: [
        zohoSalesIQ,
        "departmentId",
        (c) => ({
          screenName: c.screenName,
        }),
      ],
    },
    categoryId: {
      propDefinition: [
        zohoSalesIQ,
        "articleCategoryId",
        (c) => ({
          screenName: c.screenName,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the article",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The HTML content available in the article",
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "Specify the publishing status of the article",
    },
  },
  async run({ $ }) {
    const { data } = await this.zohoSalesIQ.createArticle({
      screenName: this.screenName,
      data: {
        category_id: this.categoryId,
        title: this.title,
        content: this.content,
        department_id: this.departmentId,
        published: this.published,
      },
      $,
    });

    $.export("$summary", `Successfully created article with ID ${data.id}.`);

    return data;
  },
};
