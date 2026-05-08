import fs from "fs";
import app from "../../veremark.app.mjs";

export default {
  key: "veremark-download-document",
  name: "Download Candidate Document",
  description:
    "Downloads a supporting document uploaded by a candidate during the background check process."
    + " Document GUIDs are found in the response from **Get Background Check Request** — look in the checks array for document references."
    + " The file is written to the /tmp directory and returned as a presigned download URL via File Stash."
    + " Common document types include resumes, ID scans, and employment letters."
    + " [See the documentation](https://help.veremark.com/download-pdf-reports-and-supporting-documents)",
  version: "0.0.2",
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
      description: "The unique GUID of the document to download. Found in the response from **Get Background Check Request** within the checks data.",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const filename = `veremark-document-${this.documentGuid}`;
    const filePath = `${process.env.STASH_DIR || "/tmp"}/${filename}`;

    let buffer;
    try {
      buffer = await this.app._makeRequest({
        $,
        path: `/document/${this.documentGuid}/`,
        responseType: "arraybuffer",
      });
    } catch (err) {
      const status = err?.response?.status;
      const msg = status === 404
        ? "Document not found — the document GUID may be invalid or the document has been removed."
        : status === 403
          ? "Access denied — check that this document belongs to a request in your account."
          : status
            ? `Failed to download document (HTTP ${status}).`
            : `Failed to download document: ${err.message}`;
      $.export("$summary", msg);
      return {
        error: msg,
        documentGuid: this.documentGuid,
      };
    }

    fs.writeFileSync(filePath, Buffer.from(buffer));
    $.export("$summary", `Downloaded document ${this.documentGuid}`);
    return {
      filePath,
      filename,
      documentGuid: this.documentGuid,
    };
  },
};
