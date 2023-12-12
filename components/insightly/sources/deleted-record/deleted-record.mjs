import common from "../common/common.mjs";

export default {
  ...common,
  key: "insightly-deleted-record",
  name: "Deleted Record",
  description: "Emit new event when a record is deleted.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getPreviousIds() {
      return this.db.get("previousIds") || [];
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    generateMeta(id) {
      return {
        id,
        summary: `${this.recordType} Record ${id} Deleted`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const previousIds = this._getPreviousIds();
    const records = await this.getPaginatedResults(true);
    const recordIds = records.map((record) => this.getRecordId(record));

    for (const prevId of previousIds) {
      if (!recordIds.includes(prevId)) {
        this.$emit({
          id: prevId,
        }, this.generateMeta(prevId));
      }
    }

    this._setPreviousIds(recordIds);
  },
};
