import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-delete-table",
  name: "Delete Table",
  description: "Remove an entire table, structure and contents, from the document. Use this to clear a table completely, including an empty table left behind after its text was removed. Set **Table Number** to pick which table to remove (1 = first top-level table in the document, in reading order; a table nested inside another table's cell doesn't count separately). Use **Get Document** first if you need to confirm how many tables exist. This also works on a table linked to a Google Sheet, since removal is treated as ordinary content deletion. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#DeleteContentRangeRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    tableIndex: {
      type: "integer",
      label: "Table Number",
      description: "Which table to delete, counting top-level tables in the document body in reading order (`1` = first table). Defaults to `1`, the common case of removing the document's only table.",
      min: 1,
      optional: true,
      default: 1,
    },
  },
  async run({ $ }) {
    const { body } = await this.googleDocs.getDocument(this.documentId, false, "body");
    const tables = this.googleDocs.flattenTables(body?.content);

    if (!tables.length) {
      throw new ConfigurationError(`Document ${this.documentId} has no tables to delete.`);
    }
    if (this.tableIndex > tables.length) {
      throw new ConfigurationError(`Document ${this.documentId} only has ${tables.length} table(s); table number ${this.tableIndex} does not exist.`);
    }

    const {
      startIndex, endIndex,
    } = tables[this.tableIndex - 1];
    await this.googleDocs.deleteTable(this.documentId, {
      startIndex,
      endIndex,
    });

    $.export("$summary", `Deleted table ${this.tableIndex} of ${tables.length} from document ${this.documentId}`);
    return this.googleDocs.getDocument(this.documentId);
  },
};
