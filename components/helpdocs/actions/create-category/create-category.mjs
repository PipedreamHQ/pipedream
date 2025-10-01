import helpdocs from "../../helpdocs.app.mjs";

export default {
  key: "helpdocs-create-category",
  name: "Create Category",
  description: "Create a new category in your HelpDocs knowledge base to organize articles. [See the documentation](https://apidocs.helpdocs.io/article/i5gdcZ7b9s-creating-a-category)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    helpdocs,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the category",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the category",
      optional: true,
    },
  },
  async run({ $ }) {
    const { category } = await this.helpdocs.createCategory({
      $,
      data: {
        title: this.title,
        description: this.description,
      },
    });

    $.export("$summary", `Created category ${this.title}`);
    return category;
  },
};
