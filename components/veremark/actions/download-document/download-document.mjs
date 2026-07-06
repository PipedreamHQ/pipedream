import fs from "fs";
import app from "../../veremark.app.mjs";

export default {
  key: "veremark-download-document",
  name: "Download candidate-uploaded document via File Stash",
  description:
    "Downloads a supporting document uploaded by a candidate during the background check process and saves it via File Stash."
    + " Document GUIDs are found in the response from **Get Background Check Request** — look in the checks array for document references."
    + " Common document types include resumes, ID scans, and employment letters."
    + " [See the documentation](https://api.veremark.com/external/v1/docs/#tag/document/operation/retrieveDocumentDownload)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    documentGuid: {
      type: "string",
      label: "Document GUID",
      description: "The unique GUID of the document to download. Found in the response from **Get Background Check Request** within the checks data. Example: `123e4567-e89b-12d3-a456-426614174000`.",
    },
    syncDir: {
      propDefinition: [
        app,
        "syncDir",
      ],
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const filename = `veremark-document-${this.documentGuid}`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    let buffer;
    try {
      buffer = await this.app.downloadDocument({
        $,
        documentGuid: this.documentGuid,
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 404
        ? `Document ${this.documentGuid} not found. Verify the GUID is correct and the document exists in the request's checks array.`
        : status === 403
          ? `Access denied for document ${this.documentGuid}. Check that it belongs to a request in your account.`
          : `Failed to download document ${this.documentGuid}: HTTP ${status ?? "unknown"}`;
      $.export("$summary", msg);
      return {
        error: msg,
        documentGuid: this.documentGuid,
      };
    }

    fs.writeFileSync(filePath, Buffer.from(buffer));
    $.export("$summary", `Downloaded document ${this.documentGuid} to ${filename}`);
    return {
      filePath,
      filename,
      documentGuid: this.documentGuid,
    };
  },
};
