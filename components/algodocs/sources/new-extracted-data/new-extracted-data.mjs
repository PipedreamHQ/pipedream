import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../algodocs.app.mjs";
import {
  lastTsMethods, pollForNewItems,
} from "../../common/polling.mjs";

export default {
  key: "algodocs-new-extracted-data",
  name: "New Extracted Data",
  description:
    "Emit new event for each newly extracted data record for a given AlgoDocs document (polls GET /v1/extracted_data/{documentId}). Each extraction record's stable `id` is used for deduplication. Run the **List Documents** action to find a valid document ID before configuring this source. An optional filter narrows emissions to records whose extracted `data` matches a provided key or value substring. [See the documentation](https://api.algodocs.com/).",
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
    extractedDataFilter: {
      type: "string",
      label: "Extracted Data Filter",
      description:
        "Optional. A free-form substring matched client-side against the extracted `data` of each record; only matching records are emitted. Leave blank to emit every new extraction record. Example: `InvoiceNumber` or `Acme`.",
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
      extractItems: (record, ts) => [
        {
          id: record.id,
          payload: record,
          summary: `New extracted data record ${record.id} for document ${this.documentId}`,
          ts,
          filterText: JSON.stringify(record.data ?? record),
        },
      ],
      matchesFilter: (entry) =>
        !this.extractedDataFilter || entry.filterText.includes(this.extractedDataFilter),
    });
  },
};
