import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";

export default {
  key: "google_docs-write-table",
  name: "Write Table",
  description: "Create a table and fill it with data in a single step. Provide the entire table (all rows and columns, including a header row) at once. Use this instead of inserting cells or text one at a time. The action places every value in the correct cell for you. Pass **Table Data** as a JSON array of arrays, one inner array per row, header row first when **Has Header Row** is set, e.g. `[[\"Name\",\"Role\"],[\"Ada\",\"Engineer\"]]`. Use **Find Document** to resolve a document's name to its ID, or **Insert Table** instead if you only need an empty grid to fill in later. Note: a table written this way is always static — the Google Docs API does not create or preserve a live link to a Google Sheet, even when this replaces a Sheets-linked table. [See the documentation](https://developers.google.com/docs/api/reference/rest/v1/documents/request#InsertTableRequest)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
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
    rows: {
      type: "string",
      label: "Table Data",
      description: "JSON array of rows, one inner array per row, each holding that row's cell values in column order. Header row first if **Has Header Row** is set. Example: `[[\"Name\",\"Role\"],[\"Ada\",\"Engineer\"],[\"Grace\",\"Admiral\"]]`. Rows may have different lengths; the table is sized to the widest row and shorter rows leave their remaining cells blank.",
    },
    hasHeaderRow: {
      type: "boolean",
      label: "Has Header Row",
      description: "When `true`, the first row in **Table Data** is treated as a header and its text is bolded. Defaults to `false`.",
      optional: true,
      default: false,
    },
    position: {
      propDefinition: [
        googleDocs,
        "position",
      ],
    },
  },
  async run({ $ }) {
    let rows;
    try {
      rows = typeof this.rows === "string"
        ? JSON.parse(this.rows)
        : this.rows;
    } catch {
      throw new ConfigurationError("Table Data must be valid JSON. Example: [[\"Name\",\"Role\"],[\"Ada\",\"Engineer\"]]");
    }

    const isValid = Array.isArray(rows) && rows.length
      && rows.every((row) => Array.isArray(row) && row.length);
    if (!isValid) {
      throw new ConfigurationError("Table Data must be a non-empty JSON array of non-empty arrays, one per row. Example: [[\"Name\",\"Role\"],[\"Ada\",\"Engineer\"]]");
    }

    const document = await this.googleDocs.writeTable(this.documentId, {
      rows,
      position: this.position,
      hasHeaderRow: this.hasHeaderRow,
    });

    const numColumns = rows.reduce((max, row) => Math.max(max, row.length), 0);
    $.export("$summary", `Wrote a ${rows.length}x${numColumns} table into document ${this.documentId}`);
    return document;
  },
};
