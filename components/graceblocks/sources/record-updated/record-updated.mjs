import common from "../common/base-polling.mjs";
import md5 from "md5";

export default {
  ...common,
  key: "graceblocks-record-updated",
  name: "Record Updated",
  description: "Emit new event when a record is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousRecords() {
      return this.db.get("previousRecords") || {};
    },
    _setPreviousRecords(previousRecords) {
      this.db.set("previousRecords", previousRecords);
    },
    getResourceFn() {
      return this.graceblocks.listRecords;
    },
    getParams() {
      return {
        sortField: this.getTsField(),
        sortOrder: "desc",
      };
    },
    getTsField() {
      return "Updated on";
    },
    filterItems(items) {
      const previousRecords = this._getPreviousRecords();
      const updatedRecords = [];
      for (const item of items) {
        const hash = md5(JSON.stringify(item));
        if (previousRecords[item.id] && previousRecords[item.id] === hash) {
          continue;
        }
        updatedRecords.push(item);
        previousRecords[item.id] = hash;
      }
      this._setPreviousRecords(previousRecords);
      return updatedRecords;
    },
    generateMeta(record) {
      const hash = md5(JSON.stringify(record));
      return {
        id: hash,
        summary: `Updated Record: ${record.Name}`,
        ts: Date.parse(record[this.getTsField()]),
      };
    },
  },
};
