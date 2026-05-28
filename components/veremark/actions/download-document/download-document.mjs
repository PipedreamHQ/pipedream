import app from "../../veremark.app.mjs";

export default {
  key: "veremark-download-document",
  name: "Download Candidate Document",
  description:
    "Downloads a supporting document uploaded by a candidate during the background check process."
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
  },
  async run({ $ }) {
    let buffer;
    try {
      buffer = await this.app.downloadDocument({
        $,
        documentGuid: this.documentGuid,
      });
    } catch (err) {
      const status = err.response?.status;
      if (status === 404) {
        $.export("$summary", `Document ${this.documentGuid} not found`);
        return {
          found: false,
          message: `Document ${this.documentGuid} not found. Verify the GUID is correct and the document exists in the request's checks array.`,
        };
      }
      // Re-throw non-404 errors with clean message to avoid binary data overflowing MCP context
      throw new Error(`Failed to download document ${this.documentGuid}: HTTP ${status ?? "unknown"}`);
    }
    $.export("$summary", `Downloaded document ${this.documentGuid}`);
    return Buffer.from(buffer);
  },
};
