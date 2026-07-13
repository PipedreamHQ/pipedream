import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-new-table-row-extracted",
  name: "New Table Row Extracted",
  description:
    "Emit a new event for each individual table row extracted from an AlgoDocs document (polls GET /v1/extracted_data/{documentId}). Unlike **New Extracted Data** which emits one event per extraction record, this source emits one event per row within the extracted `data` array. Requires a document ID — run **List Documents** to find one. An optional filter narrows emissions to rows whose JSON representation contains a specified substring. [See the documentation](https://api.algodocs.com/).",
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
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(ts) {
      this.db.set("lastTs", ts);
    },
  },
  async run() {
    const response = await this.algodocs.getExtractedDataByDocument({
      documentId: this.documentId,
    });

    const records = Array.isArray(response)
      ? response
      : (response?.data ?? []);

    if (!records.length) {
      return;
    }

    const lastTs = this._getLastTs();
    const isFirstRun = lastTs == null;

    // Collect (id, row, recordId, ts) tuples from qualifying records.
    // The API returns records newest-first, so we iterate in that order.
    const rowEntries = [];
    for (const record of records) {
      const rawTs = record.processedAt || record.uploadedAt;
      const ts = rawTs
        ? Date.parse(rawTs)
        : Date.now();

      // On subsequent runs skip records strictly older than last-seen timestamp.
      // Records at exactly lastTs are re-evaluated so same-timestamp newcomers
      // with different IDs are not missed; dedupe: "unique" prevents re-emitting.
      if (!isFirstRun && ts < lastTs) {
        continue;
      }

      const rows = Array.isArray(record.data)
        ? record.data
        : (record.data != null
          ? [
            record.data,
          ]
          : []);

      rows.forEach((row, rowIndex) => {
        rowEntries.push({
          id: `${record.id}-${rowIndex}`,
          row,
          recordId: record.id,
          ts,
        });
      });
    }

    // On first run, cap to 25 rows to avoid flooding.
    // API returns newest-first so the first 25 entries are the most recent.
    const candidates = isFirstRun
      ? rowEntries.slice(0, 25)
      : rowEntries;

    let maxTs = lastTs ?? 0;

    for (const {
      id, row, recordId, ts,
    } of candidates) {
      if (this.tableRowFilter) {
        const rowStr = JSON.stringify(row);
        if (!rowStr.includes(this.tableRowFilter)) {
          continue;
        }
      }

      this.$emit(row, {
        id,
        summary: `New table row from document ${this.documentId} (record ${recordId})`,
        ts,
      });

      if (ts > maxTs) {
        maxTs = ts;
      }
    }

    if (maxTs > (lastTs ?? 0)) {
      this._setLastTs(maxTs);
    }
  },
};
