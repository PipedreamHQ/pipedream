import common from "../common/common.mjs";

export default {
  ...common,
  key: "zoho_recruit-record-updated",
  name: "New Record Updated",
  description: "Emit new event when a record is updated.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResources({ params }) {
      const { data } = await this.zohoRecruit.listRecords({
        moduleName: this.module,
        params: {
          ...params,
          sort_order: "desc",
          sort_by: this.getTsKey(),
        },
      });
      return data;
    },
    getTsKey() {
      return "Updated_On";
    },
    generateMeta(record) {
      const ts = Date.parse(record[this.getTsKey()]);
      return {
        id: `${record.id}${ts}`,
        summary: `Updated Record with ID ${record.id}`,
        ts,
      };
    },
  },
};
