import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-delete-table",
  name: "Delete Table",
  description: "Remove an entire table, structure and contents, from the document. Use this to clear a table completely, including an empty table left behind after its text was removed. Set **Table Number** to pick which table to remove (1 = first top-level table in the document, in reading order; a table nested inside another table's cell doesn't count separately). Use **Get Document** first if you need to confirm how many tables exist. This also works on a table linked to a Google Sheet, since removal is treated as ordinary content deletion. Use **Find Document** to resolve a document's name to its ID. In a multi-tab document, set **Tab ID** to choose which tab to delete from — without it the first tab's tables are the ones counted and removed; use **List Tabs** to get the IDs. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#DeleteContentRangeRequest)",
  version: "0.1.0",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
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
      description: "Which table to delete, counting top-level tables in reading order (`1` = first table). Defaults to `1`, the common case of removing the only table. In a multi-tab document, tables are counted within the tab named by **Tab ID**, or within the first tab when that is omitted.",
      min: 1,
      optional: true,
      default: 1,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "contentTabId",
      ],
    },
  },
  async run({ $ }) {
    const target = this.tabId
      ? `tab ${this.tabId} of document ${this.documentId}`
      : `document ${this.documentId}`;
    const tables = this.googleDocs.flattenTables(
      await this.googleDocs.getTabBodyContent(this.documentId, this.tabId),
    );

    if (!tables.length) {
      throw new ConfigurationError(`There are no tables to delete in ${target}.`);
    }
    if (this.tableIndex > tables.length) {
      throw new ConfigurationError(`There are only ${tables.length} table(s) in ${target}; table number ${this.tableIndex} does not exist.`);
    }

    const {
      startIndex, endIndex,
    } = tables[this.tableIndex - 1];
    await this.googleDocs.deleteTable(this.documentId, {
      startIndex,
      endIndex,
      tabId: this.tabId,
    });

    $.export("$summary", `Deleted table ${this.tableIndex} of ${tables.length} from ${target}`);
    return this.googleDocs.getWriteResult(this.documentId, this.tabId);
  },
};
