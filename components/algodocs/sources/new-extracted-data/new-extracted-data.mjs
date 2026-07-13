import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-new-extracted-data",
  name: "New Extracted Data",
  description:
    "Emit a new event for each newly extracted data record for a given AlgoDocs document (polls GET /v1/extracted_data/{documentId}). Each extraction record's stable `id` is used for deduplication. Run the **List Documents** action to find a valid document ID before configuring this source. An optional filter narrows emissions to records whose extracted `data` matches a provided key or value substring. [See the documentation](https://api.algodocs.com/).",
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
        "Optional. A free-form substring matched client-side against the extracted `data` of each record; only matching records are emitted. Leave blank to emit every new extraction record. Example: `InvoiceNumber` or `Acme`.",
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
      $: this,
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

    // On first run, emit only the most recent 25 records to avoid flooding.
    // The API returns records newest-first so the first 25 are the most recent.
    const candidates = isFirstRun
      ? records.slice(0, 25)
      : records;

    let maxTs = lastTs ?? 0;

    for (const record of candidates) {
      const rawTs = record.processedAt || record.uploadedAt;
      const ts = rawTs
        ? Date.parse(rawTs)
        : Date.now();

      // On subsequent runs, skip records that are strictly older than the
      // last-seen timestamp. Records at exactly lastTs are re-evaluated so
      // that any same-timestamp newcomers with different IDs are not missed;
      // dedupe: "unique" prevents re-emitting records already seen.
      if (!isFirstRun && ts < lastTs) {
        continue;
      }

      if (this.tableRowFilter) {
        const dataStr = JSON.stringify(record.data ?? record);
        if (!dataStr.includes(this.tableRowFilter)) {
          continue;
        }
      }

      this.$emit(record, {
        id: record.id,
        summary: `New extracted data record ${record.id} for document ${this.documentId}`,
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
