import documenso from "../../documenso.app.mjs";

export default {
  key: "documenso-create-document-from-template",
  name: "Create Document From Template",
  description: "Create a new document in Documenso from a pre-existing template.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    documenso,
    templateId: documenso.propDefinitions.templateId,
    documentSettings: {
      ...documenso.propDefinitions.documentSettings,
      optional: true,
    },
    metadata: {
      ...documenso.propDefinitions.metadata,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.documenso.createDocumentFromTemplate({
      templateId: this.templateId,
      documentSettings: this.documentSettings,
      metadata: this.metadata,
    });
    $.export("$summary", `Successfully created document with ID: ${response.id}`);
    return response;
  },
};
