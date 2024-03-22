import quickbase from "../../quickbase.app.mjs";

export default {
  key: "quickbase-new-record",
  name: "New Record",
  description: "Emits an event each time a new record is created in a specified table in Quickbase",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    quickbase,
    db: "$.service.db",
    tableId: {
      propDefinition: [
        quickbase,
        "tableId",
      ],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getPreviousLastRecord() {
      return this.db.get("previousLastRecord") || null;
    },
    _setPreviousLastRecord(lastRecord) {
      this.db.set("previousLastRecord", lastRecord);
    },
  },
  async run() {
    const lastRecord = this._getPreviousLastRecord();
    const records = await this.quickbase.getRecords(this.tableId);
    const sortedRecords = records.sort((a, b) => new Date(b.created) - new Date(a.created));
    const newestRecord = sortedRecords[0];
    if (!lastRecord || new Date(newestRecord.created) > new Date(lastRecord.created)) {
      for (const record of sortedRecords) {
        if (new Date(record.created) > new Date(lastRecord.created)) {
          this.$emit(record, {
            id: record.id,
            summary: `New Record in table ${this.tableId}: ${record.id}`,
            ts: Date.parse(record.created),
          });
        } else {
          break;
        }
      }
      this._setPreviousLastRecord(newestRecord);
    }
  },
};
