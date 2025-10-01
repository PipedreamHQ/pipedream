import app from "../../signnow.app.mjs";

export default {
  key: "signnow-create-document-from-template",
  name: "Create Document From Template",
  description: "Creates a new document copy out of a template. [See the documentation](https://docs.signnow.com/docs/signnow/template/operations/create-a-template-copy)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
    documentName: {
      propDefinition: [
        app,
        "documentName",
      ],
    },
  },
  methods: {
    createDocumentFromTemplate({
      templateId, ...args
    }) {
      return this.app.post({
        path: `/template/${templateId}/copy`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createDocumentFromTemplate,
      templateId,
      documentName,
    } = this;

    const response = await createDocumentFromTemplate({
      $,
      templateId,
      data: {
        document_name: documentName,
      },
    });
    $.export("$summary", `Successfully created a document from template with ID: \`${response.id}\`.`);
    return response;
  },
};
