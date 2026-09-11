import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-delete-table",
  name: "Delete Table",
  description: "Remove an entire table, structure and contents, from the document. Use this to clear a table completely, including an empty table left behind after its text was removed. Set **Table Number** to pick which table to remove (1 = first top-level table in the document, in reading order; a table nested inside another table's cell doesn't count separately). Use **Get Document** first if you need to confirm how many tables exist. This also works on a table linked to a Google Sheet, since removal is treated as ordinary content deletion. Use **Find Document** to resolve a document's name to its ID. Pass **Fields** (e.g. `documentId,title,revisionId`) to get a compact confirmation instead of the whole document. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#DeleteContentRangeRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
    fields: {
      type: "string",
      label: "Fields",
      description: "Optional Google Docs API field mask limiting which document fields are returned, e.g. `documentId,title,revisionId` to confirm the write without pulling the whole document back. Only top-level fields of the Docs document resource are valid: `documentId`, `title`, `revisionId`, `body`, `documentStyle`, `namedStyles`, `inlineObjects`, `lists`, `namedRanges`, `tabs`. There is no `url` field, and an unknown field name fails the call. Nested selections are allowed, e.g. `body/content` or `tabs(documentTab(body))`. Leave blank to return the full document. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents#Document)",
      optional: true,
    },
  },
  async run({ $ }) {
    utils.validateFieldMask(this.fields);

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
    return this.googleDocs.getDocument(this.documentId, false, this.fields);
  },
};
