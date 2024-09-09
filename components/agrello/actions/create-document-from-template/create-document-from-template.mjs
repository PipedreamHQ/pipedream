import agrello from "../../agrello.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agrello-create-document-from-template",
  name: "Create Document from Template",
  description: "Creates a new document in Agrello, invites participants, and fills file variables. [See the documentation](https://api.agrello.io/public/webjars/swagger-ui/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agrello,
    folderId: {
      propDefinition: [
        agrello,
        "folderId",
      ],
    },
    name: {
      type: "string",
      label: "Document Name",
      description: "The name of the document",
    },
    outputType: {
      type: "string",
      label: "Output Type",
      description: "The output type of the document",
      options: [
        "pdf",
        "asice",
        "zip",
      ],
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "The variables for the document",
    },
    signers: {
      type: "string[]",
      label: "Signers",
      description: "The signers of the document",
    },
    viewers: {
      type: "string[]",
      label: "Viewers",
      description: "The viewers of the document",
    },
    immediatePublish: {
      type: "boolean",
      label: "Immediate Publish",
      description: "Whether to publish the document immediately",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata for the document",
    },
    templateId: {
      propDefinition: [
        agrello,
        "templateId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      folderId: this.folderId,
      name: this.name,
      outputType: this.outputType,
      variables: this.variables,
      signers: this.signers,
      viewers: this.viewers,
      immediatePublish: this.immediatePublish,
      metadata: this.metadata,
      templateId: this.templateId,
    };

    const response = await this.agrello.createDocument(data);
    $.export("$summary", `Successfully created document with ID ${response.id}`);
    return response;
  },
};
