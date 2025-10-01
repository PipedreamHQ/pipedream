import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-get-category",
  name: "Get Category",
  description: "Retrieve a category from your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/FCRNPUXm3i-getting-a-single-category)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    helpdocs,
    categoryId: {
      propDefinition: [
        helpdocs,
        "categoryId",
      ],
    },
  },
  async run({ $ }) {
    const { category } = await this.helpdocs.getCategory({
      $,
      categoryId: this.categoryId,
    });

    $.export("$summary", `Retrieved category ${this.categoryId}`);
    return category;
  },
};
