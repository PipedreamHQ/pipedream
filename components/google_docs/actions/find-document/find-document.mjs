import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-find-document",
  name: "Find Document",
  description: "Search for Google Docs by name or full-text content. Returns a list of `{id, name, url, modifiedTime}`. Use this first to resolve a document's name to its ID, then pass the `id` to **Get Document**, **Export Document**, or any of the insert/replace tools. [See the documentation](https://developers.google.com/drive/api/v3/reference/files/list)",
  version: "1.0.1",
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
      description: "Text to search for in document names and contents. Matches documents whose name contains the query OR whose full text contains the query. Example: `InGen Site Manifest`. Leave blank to list recent documents.",
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
    const files = await this.googleDocs.findDocuments({
      query: this.query,
      limit: this.limit,
    });
    $.export("$summary", `Found ${files.length} document${files.length === 1
      ? ""
      : "s"}${this.query
      ? ` matching "${this.query}"`
      : ""}`);
    return files;
  },
};
