import { STATUS_OPTIONS } from "../../common/constants.mjs";
import pdfmonkey from "../../pdfmonkey.app.mjs";

export default {
  key: "pdfmonkey-generate-document",
  name: "Generate Document",
  description: "Generates a new document using a specified template. [See the documentation](https://docs.pdfmonkey.io/references/api/documents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pdfmonkey,
    templateId: {
      propDefinition: [
        pdfmonkey,
        "templateId",
      ],
    },
    payload: {
      type: "object",
      label: "Payload",
      description: "Data to use for the Document generation.",
      optional: true,
    },
    meta: {
      type: "object",
      label: "Meta",
      description: "Meta-Data to attach to the Document.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the document",
      options: STATUS_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.pdfmonkey.createDocument({
      $,
      data: {
        document: {
          document_template_id: this.templateId,
          payload: this.payload,
          meta: this.meta,
          status: this.status,
        },
      },
    });

    $.export("$summary", `Successfully generated document with ID ${response.document.id}`);
    return response;
  },
};
