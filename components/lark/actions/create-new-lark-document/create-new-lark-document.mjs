import lark from "../../lark.app.mjs";

export default {
  key: "lark-create-new-lark-document",
  name: "Create New Lark Document",
  description: "Creates a new Lark document. [See the documentation](https://open.larksuite.com/document/server-docs/docs/docs/docx-v1/document/create)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    documentTitle: {
      type: "string",
      label: "Document Title",
      description: "The title of the new Lark document",
      optional: true,
    },
    folderToken: {
      propDefinition: [
        lark,
        "folderToken",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lark.createDocument({
      $,
      data: {
        title: this.documentTitle,
        folder_token: this.folderToken,
      },
    });

    $.export("$summary", `Successfully created document with ID: ${response.data.document.document_id}`);
    return response;
  },
};
