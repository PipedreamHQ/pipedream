import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-document-details",
  name: "Get Document Details",
  description: "Return detailed data about a document. [See the documentation here](https://developers.pandadoc.com/reference/document-details)",
  type: "action",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
