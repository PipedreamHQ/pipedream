import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "algodocs-new-extracted-data",
  name: "New Extracted Data",
  description:
    "Emit new event for each newly extracted data record for a given AlgoDocs document (polls GET /v1/extracted_data/{documentId}). Each extraction record's stable `id` is used for deduplication. Run the **List Documents** action to find a valid document ID before configuring this source. An optional filter narrows emissions to records whose extracted `data` matches a provided key or value substring. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    extractedDataFilter: {
      type: "string",
      label: "Extracted Data Filter",
      description:
        "Optional. A free-form substring matched client-side against the extracted `data` of each record; only matching records are emitted. Leave blank to emit every new extraction record. Example: `InvoiceNumber` or `Acme`.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    extractItems(record, ts) {
      return [
        {
          id: record.id,
          payload: record,
          summary: `New extracted data record ${record.id} for document ${this.documentId}`,
          ts,
          filterText: JSON.stringify(record.data ?? record),
        },
      ];
    },
    matchesFilter(entry) {
      return !this.extractedDataFilter || entry.filterText.includes(this.extractedDataFilter);
    },
  },
  sampleEmit,
};
