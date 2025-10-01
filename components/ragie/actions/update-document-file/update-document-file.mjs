import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import ragie from "../../ragie.app.mjs";

export default {
  key: "ragie-update-document-file",
  name: "Update Document File",
  description: "Updates an existing document file in Ragie. [See the documentation](https://docs.ragie.ai/reference/updatedocumentfile).",
  version: "0.1.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ragie,
    documentId: {
      propDefinition: [
        ragie,
        "documentId",
      ],
    },
    mode: {
      propDefinition: [
        ragie,
        "documentMode",
      ],
      optional: true,
    },
    file: {
      propDefinition: [
        ragie,
        "documentFile",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (this.mode) data.append("mode", this.mode);

    const response = await this.ragie.updateDocumentFile({
      $,
      documentId: this.documentId,
      data,
      headers: data.getHeaders(),
    });
    $.export("$summary", `Successfully updated document file with ID: ${this.documentId}`);
    return response;
  },
};
