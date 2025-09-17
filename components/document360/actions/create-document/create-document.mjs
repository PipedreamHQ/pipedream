import document360 from "../../document360.app.mjs";

export default {
  key: "document360-create-document",
  name: "Create Document",
  description: "Creates a new document in Document360 from text. [See the documentation](https://apidocs.document360.com/apidocs/how-to-create-and-publish-an-article)",
  version: "0.0.2",
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
      propDefinition: [
        document360,
        "categoryId",
        ({ projectVersionId }) => ({
          projectVersionId,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Document Title",
      description: "The title of the new document.",
    },
    userId: {
      propDefinition: [
        document360,
        "userId",
      ],
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The type of content of the new document.",
      options: [
        {
          value: "0",
          label: "Markdown",
        },
        {
          value: "1",
          label: "WYSIWYG(HTML)",
        },
        {
          value: "2",
          label: "Advanced WYSIWYG(HTML)",
        },
      ],
      optional: true,
    },
    content: {
      type: "string",
      label: "Document Content",
      description: "The content of the new document.",
    },
    order: {
      type: "integer",
      label: "Document Order",
      description: "The order position of the document within the category. For example, `0` will be the first in the category, `4` will be the fifth in the category.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.document360.createDocument({
      $,
      data: {
        category_id: this.categoryId,
        project_version_id: this.projectVersionId,
        title: this.title,
        user_id: this.userId,
        content: this.content,
        order: this.order,
        content_type: this.contentType,
      },
    });

    if (!response.success) {
      $.export("response", response);
      throw new Error("Failed to create document - see the API response for more details.");
    }

    $.export("$summary", `Successfully created document "${this.title}"`);
    return response;
  },
};
