import document360 from "../../document360.app.mjs";

export default {
  key: "document360-create-document",
  name: "Create Document",
  description: "Creates a new document in Document360 from text. [See the documentation](https://apidocs.document360.com/apidocs/how-to-create-and-publish-an-article)",
  version: "0.0.1",
  type: "action",
  props: {
    document360,
    projectVersionId: {
      propDefinition: [
        document360,
        "projectVersionId",
      ],
    },
    categoryId: {
      type: "string",
      label: "Category ID",
      description: "The ID of the category where the document will be created.",
    },
    title: {
      type: "string",
      label: "Document Title",
      description: "The title of the new document.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID of the creator of the document.",
    },
    content: {
      type: "string",
      label: "Document Content",
      description: "The content of the new document.",
    },
    order: {
      type: "integer",
      label: "Document Order",
      description: "The order position of the document within the category.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.document360.createDocument({
      categoryId: this.categoryId,
      projectVersionId: this.projectVersionId,
      title: this.title,
      userId: this.userId,
      content: this.content,
      order: this.order,
    });

    $.export("$summary", `Successfully created document titled '${this.title}'`);
    return response;
  },
};
