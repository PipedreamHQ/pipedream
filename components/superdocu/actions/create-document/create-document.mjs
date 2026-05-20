import app from "../../superdocu.app.mjs";

export default {
  key: "superdocu-create-document",
  name: "Create Document",
  description: "Create a document in Superdocu. [See the documentation](https://developers.superdocu.com/api/index.html)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createDocument({
      $,
      title: this.title,
      templateId: this.templateId,
    });

    const documentId = response?.id || response?.data?.id;
    $.export("$summary", documentId
      ? `Successfully created document with ID \`${documentId}\``
      : "Successfully created document");

    return response;
  },
};
