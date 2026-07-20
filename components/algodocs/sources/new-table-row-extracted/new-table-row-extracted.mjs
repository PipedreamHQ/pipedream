import { createHash } from "crypto";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

const MAX_ID_LENGTH = 64;

// Content-derived (not positional) so a row keeps the same ID across polls even
// if rows are reordered or inserted/removed elsewhere in the same table field.
function buildRowId(recordId, field, row) {
  const contentHash = createHash("sha256")
    .update(JSON.stringify(row))
    .digest("hex")
    .slice(0, 16);
  const readableId = `${recordId}-${field}-${contentHash}`;
  if (readableId.length <= MAX_ID_LENGTH) {
    return readableId;
  }
  // recordId/field are long enough that the readable form would exceed the
  // limit; fall back to a full hash of all three components (64 hex chars).
  return createHash("sha256")
    .update(`${recordId}-${field}-${JSON.stringify(row)}`)
    .digest("hex");
}

export default {
  ...common,
  key: "algodocs-new-table-row-extracted",
  name: "New Table Row Extracted",
  description:
    "Emit new event for each individual table row extracted from an AlgoDocs document (polls GET /v1/extracted_data/{documentId}). AlgoDocs represents a record's extracted `data` as a flat object, with any table/repeating field appearing as an array-valued property (e.g. `data.LineItems`). Unlike **New Extracted Data** which emits one event per extraction record, this source emits one event per row within each such array field; records with no array-valued field in `data` produce no events. Requires a document ID — run **List Documents** to find one. An optional filter narrows emissions to rows whose JSON representation contains a specified substring. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tableRowFilter: {
      type: "string",
      label: "Table Row Filter",
      description:
        "Optional. A free-form substring matched client-side against the JSON representation of each extracted table row; only rows whose JSON contains this substring are emitted. Leave blank to emit every row. Example: `InvoiceNumber` or `Acme`.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    // A "table row" is an element of any array-valued field within `data`
    // (e.g. `data.LineItems`). Records without such a field yield no rows.
    extractItems(record, ts) {
      const tableFields = record.data != null
        ? Object.entries(record.data).filter(([
          , value,
        ]) => Array.isArray(value))
        : [];

      return tableFields.flatMap(([
        field,
        rows,
      ]) =>
        rows.map((row) => ({
          id: buildRowId(record.id, field, row),
          payload: row,
          summary: `New table row from document ${this.documentId} (record ${record.id})`,
          ts,
          filterText: JSON.stringify(row),
        })));
    },
    matchesFilter(entry) {
      return !this.tableRowFilter || entry.filterText.includes(this.tableRowFilter);
    },
  },
  sampleEmit,
};
