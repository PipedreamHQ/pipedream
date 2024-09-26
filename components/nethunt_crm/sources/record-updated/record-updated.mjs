import base from "../common/polling.mjs";

export default {
  ...base,
  key: "nethunt_crm-record-updated",
  name: "Record Updated",
  description: "Emit new event for every updated record. [See docs here](https://nethunt.com/integration-api#updated-record)",
  version: "0.0.1",
  type: "source",
  methods: {
    ...base.methods,
    async fetchData(opts) {
      return this.nethuntCrm.listRecentlyUpdatedRecordsInFolder(opts);
    },
    emitEvents(data) {
      for (const record of data) {
        this.$emit(record, {
          id: record.id,
          summary: `Updated record: ${record.fields.Name}`,
          ts: record.updatedAt,
        });
      }
    },
  },
};
