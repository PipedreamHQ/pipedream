import base from "../common/polling.mjs";

export default {
  ...base,
  key: "nethunt_crm-new-record-created",
  name: "New Record Created",
  description: "Emit new event for every created record. [See docs here](https://nethunt.com/integration-api#new-record)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    async fetchData(opts) {
      return this.nethuntCrm.listRecentlyCreatedRecordsInFolder(opts);
    },
    emitEvents(data) {
      for (const record of data) {
        this.$emit(record, {
          id: record.id,
          summary: `New record: ${record.fields.Name}`,
          ts: record.createdAt,
        });
      }
    },
  },
};
