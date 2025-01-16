import ragie from "../../ragie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ragie-update-document-file",
  name: "Update Document File",
  description: "Updates an existing document file in Ragie. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ragie,
    updateDocumentId: {
      propDefinition: [
        ragie,
        "updateDocumentId",
      ],
    },
    updateDocumentFile: {
      propDefinition: [
        ragie,
        "updateDocumentFile",
      ],
    },
    updateDocumentMode: {
      propDefinition: [
        ragie,
        "updateDocumentMode",
      ],
      optional: true,
    },
    updateDocumentPartition: {
      propDefinition: [
        ragie,
        "updateDocumentPartition",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ragie.updateDocumentFile({
      updateDocumentId: this.updateDocumentId,
      updateDocumentFile: this.updateDocumentFile,
      updateDocumentMode: this.updateDocumentMode,
      updateDocumentPartition: this.updateDocumentPartition,
    });
    $.export("$summary", `Successfully updated document file with ID: ${this.updateDocumentId}`);
    return response;
  },
};
