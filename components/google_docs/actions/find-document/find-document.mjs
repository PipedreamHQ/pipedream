import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-find-document",
  name: "Find Document",
  description: "Search for Google Docs by name or full-text content. Returns a list of `{id, name, url, modifiedTime}`. Use this first to resolve a document's name to its ID, then pass the `id` to **Get Document**, **Export Document**, or any of the insert/replace tools. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleDocs,
    query: {
      type: "string",
      label: "Query",
      description: "Text to search for in document names and contents. Matches documents whose name contains the query OR whose full text contains the query. Leave blank to list recent documents.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of documents to return.",
      optional: true,
      default: 25,
    },
  },
  async run({ $ }) {
    const drive = this.googleDocs.drive();
    let q = "mimeType='application/vnd.google-apps.document' and trashed=false";
    if (this.query) {
      const escaped = this.query.replace(/'/g, "\\'");
      q += ` and (name contains '${escaped}' or fullText contains '${escaped}')`;
    }
    const { data } = await drive.files.list({
      q,
      pageSize: this.limit,
      fields: "files(id,name,modifiedTime,webViewLink)",
      orderBy: "modifiedTime desc",
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const files = (data.files || []).map((f) => ({
      id: f.id,
      name: f.name,
      url: f.webViewLink || `https://docs.google.com/document/d/${f.id}/edit`,
      modifiedTime: f.modifiedTime,
    }));
    $.export("$summary", `Found ${files.length} document${files.length === 1
      ? ""
      : "s"}${this.query
      ? ` matching "${this.query}"`
      : ""}`);
    return files;
  },
};
