import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-upload-file",
  name: "Upload File",
  description:
    "Uploads a local file to an AlgoDocs folder for processing by a specific extractor via multipart/form-data (POST /v1/document/upload_local/{extractorId}/{folderId}). Returns the created document record including its `id` and upload metadata. Run **List Extractors** to find a valid extractor ID and **List Folders** to find a valid folder ID before calling this action. The returned document `id` is the value to configure in **New Extracted Data**. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    algodocs: app,
    extractorId: {
      propDefinition: [
        app,
        "extractorId",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    file: {
      type: "string",
      label: "File",
      description:
        "A file URL or a path to a file in the `/tmp` directory (for example, `/tmp/invoice.pdf`). The file is sent to AlgoDocs as multipart/form-data.",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);

    const form = new FormData();
    form.append("file", stream, {
      filename: metadata.name,
      contentType: metadata.contentType,
      knownLength: metadata.size,
    });

    const response = await this.algodocs.uploadLocalFile({
      $,
      extractorId: this.extractorId,
      folderId: this.folderId,
      data: form,
      headers: form.getHeaders(),
    });

    const docId = response?.id;
    $.export(
      "$summary",
      `Uploaded file "${metadata.name}" — document ID: ${docId ?? "unknown"}`,
    );
    return response;
  },
};
