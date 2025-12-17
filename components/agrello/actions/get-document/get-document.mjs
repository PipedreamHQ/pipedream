import agrello from "../../agrello.app.mjs";

export default {
  key: "agrello-get-document",
  name: "Get Document",
  description: "Get a document in Agrello. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    agrello,
    folderId: {
      propDefinition: [
        agrello,
        "folderId",
      ],
    },
    documentId: {
      propDefinition: [
        agrello,
        "documentId",
        ({ folderId }) => ({
          folderId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.agrello.getDocument({
      $,
      documentId: this.documentId,
    });
    $.export("$summary", `Successfully retrieved document with ID ${this.documentId}`);
    return response;
  },
};
