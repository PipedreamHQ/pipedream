import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_recruit-new-record-created",
  name: "New Record Created",
  description: "Emit new event when a new record is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsKey() {
      return "Created_Time";
    },
    generateMeta(record) {
      return {
        id: record.id,
        summary: `New Record with ID ${record.id}`,
        ts: Date.parse(record[this.getTsKey()]),
      };
    },
  },
};
