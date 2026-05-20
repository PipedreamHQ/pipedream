import app from "../../superdocu.app.mjs";

export default {
  key: "superdocu-get-document",
  name: "Get Document",
  description: "Get document details from Superdocu. [See the documentation](https://developers.superdocu.com/api/index.html)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getDocument({
      $,
      documentId: this.documentId,
    });

    $.export("$summary", `Successfully retrieved document with ID \`${this.documentId}\``);

    return response;
  },
};
