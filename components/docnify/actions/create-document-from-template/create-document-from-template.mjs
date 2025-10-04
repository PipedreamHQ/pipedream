import docnify from "../../docnify.app.mjs";

export default {
  key: "docnify-create-document-from-template",
  name: "Create Document From Template",
  description: "Create a new document in Docnify from a pre-existing template. [See the documentation](https://app.docnify.io/api/v1/openapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docnify,
    templateId: {
      propDefinition: [
        docnify,
        "templateId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "Document title. Will override the original title defined in the template.",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "Document subject. Will override the original subject defined in the template.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Document message. Will override the original message defined in the template.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.docnify.createDocumentFromTemplate({
      $,
      templateId: this.templateId,
      data: {
        title: this.title,
        recipients: [],
        meta: this.subject || this.message
          ? {
            subject: this.subject,
            message: this.message,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully created document with ID: ${response.documentId}`);
    return response;
  },
};
