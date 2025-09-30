import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-get-document-status",
  name: "Get Document Status",
  description:
    "Get basic status info about a document. [See documentation here](https://developers.pandadoc.com/reference/document-status)",
  type: "action",
  version: "0.0.4",
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
    const response = await this.app.getDocument({
      id: this.id,
    });

    $.export("$summary", `Successfully fetched document status with ID ${this.id}`);
    return response;
  },
};
