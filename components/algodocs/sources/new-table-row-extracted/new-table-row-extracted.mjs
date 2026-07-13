import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../algodocs.app.mjs";
import {
  lastTsMethods, pollForNewItems,
} from "../../common/polling.mjs";

export default {
  key: "algodocs-new-table-row-extracted",
  name: "New Table Row Extracted",
  description:
    "Emit new event for each individual table row extracted from an AlgoDocs document (polls GET /v1/extracted_data/{documentId}). AlgoDocs represents a record's extracted `data` as a flat object, with any table/repeating field appearing as an array-valued property (e.g. `data.LineItems`). Unlike **New Extracted Data** which emits one event per extraction record, this source emits one event per row within each such array field; records with no array-valued field in `data` produce no events. Requires a document ID — run **List Documents** to find one. An optional filter narrows emissions to rows whose JSON representation contains a specified substring. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    algodocs: app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
    tableRowFilter: {
      type: "string",
      label: "Table Row Filter",
      description:
        "Optional. A free-form substring matched client-side against the JSON representation of each extracted table row; only rows whose JSON contains this substring are emitted. Leave blank to emit every row. Example: `InvoiceNumber` or `Acme`.",
      optional: true,
    },
  },
  methods: {
    ...lastTsMethods,
  },
  async run() {
    await pollForNewItems({
      component: this,
      fetchResponse: () => this.algodocs.getExtractedDataByDocument({
        $: this,
        documentId: this.documentId,
      }),
      // A "table row" is an element of any array-valued field within `data`
      // (e.g. `data.LineItems`). Records without such a field yield no rows.
      extractItems: (record, ts) => {
        const tableFields = record.data != null
          ? Object.entries(record.data).filter(([
            , value,
          ]) => Array.isArray(value))
          : [];

        return tableFields.flatMap(([
          field,
          rows,
        ]) =>
          rows.map((row, rowIndex) => ({
            id: `${record.id}-${field}-${rowIndex}`,
            payload: row,
            summary: `New table row from document ${this.documentId} (record ${record.id})`,
            ts,
            filterText: JSON.stringify(row),
          })));
      },
      matchesFilter: (entry) =>
        !this.tableRowFilter || entry.filterText.includes(this.tableRowFilter),
    });
  },
};
