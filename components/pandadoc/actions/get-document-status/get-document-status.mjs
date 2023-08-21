import app from "../../pandadoc.app.mjs";

export default {
  key: "pandadoc-get-document-status",
  name: "Get Document Status",
  description:
    "Get basic status info about a document. [See the docs here](https://developers.pandadoc.com/reference/document-status)",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    id: {
      propDefinition: [app, "documentId"],
    },
  },
  async run({ $ }) {
    const response = await this.app.getDocument(this.id);

    $.export("$summary", `Successfully fetched document statu with ID: ${id}`);
    return response;
  },
};
