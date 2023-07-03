import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-document-details",
  name: "Document Details",
  description: "Return detailed data about a document. [See the docs here](https://developers.pandadoc.com/reference/document-details)",
  type: "action",
  version: "0.0.4",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const { id } = this;

    const response = await this.app.documentDetails({
      $,
      id,
    });

    $.export("$summary", `Successfully fetched document with ID: ${id}`);
    return response;
  },
};
