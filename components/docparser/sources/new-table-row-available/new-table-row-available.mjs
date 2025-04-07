import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import docparser from "../../docparser.app.mjs";

export default {
  key: "docparser-new-table-row-available",
  name: "New Table Row Available",
  description: "Emit new event every time a document is processed and parsed table rows are available. [See the documentation](https://docparser.com/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    docparser,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getProcessedDocIds() {
      return this.db.get("processedDocIds") || [];
    },
    _setProcessedDocIds(ids) {
      this.db.set("processedDocIds", ids);
    },
    async pollParsedTableRows() {
      const documents = await this.docparser.listDocuments();
      const processedDocIds = this._getProcessedDocIds();
      const unprocessedDocs = documents.filter((doc) => !processedDocIds.includes(doc.id) && doc.parsed);

      for (const doc of unprocessedDocs) {
        const data = await this.docparser.getParsedTableRows(doc.id);
        data.forEach((row) => {
          this.$emit(row, {
            id: row.id,
            summary: `New Table Row: ${row.id}`,
            ts: Date.now(),
          });
        });
      }

      const newProcessedIds = processedDocIds.concat(unprocessedDocs.map((doc) => doc.id));
      this._setProcessedDocIds(newProcessedIds);
    },
  },
  hooks: {
    async deploy() {
      await this.run();
    },
    async activate() {
      console.log("Source activated");
    },
    async deactivate() {
      console.log("Source deactivated");
    },
  },
  async run() {
    await this.pollParsedTableRows();
  },
};
