import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-delete-category",
  name: "Delete Category",
  description: "Delete a category from your HelpDocs knowledge base. [See the documentation](https://apidocs.helpdocs.io/article/Hw8fVbXt1V-deleting-a-category)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.helpdocs.deleteCategory({
      $,
      categoryId: this.categoryId,
    });

    $.export("$summary", `Deleted category ${this.categoryId}`);
    return response;
  },
};
