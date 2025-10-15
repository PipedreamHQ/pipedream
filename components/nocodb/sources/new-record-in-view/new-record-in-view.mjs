import common from "../common/base.mjs";

export default {
  ...common,
  key: "nocodb-new-record-in-view",
  name: "New Record in View",
  description: "Emit new event for each new record in a view. [See the documentation](https://data-apis-v2.nocodb.com/#tag/Table-Records/operation/db-data-table-row-list)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    viewId: {
      propDefinition: [
        common.props.nocodb,
        "viewId",
        (c) => ({
          tableId: c.tableId.value || c.tableId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getDataToEmit(record) {
      return {
        id: record.id,
        summary: `New record created (${record.id})`,
        ts: Date.parse(record[this.getTimeField()]),
      };
    },
    getTimeField() {
      return "created_at";
    },
    getParams(timeField) {
      return {
        viewId: this.viewId,
        fields: timeField,
      };
    },
    async getRows(records, timeField, lastTime) {
      const rows = [];
      for await (const row of records) {
        if (!lastTime || Date.parse(row[timeField]) >= Date.parse(lastTime)) {
          rows.push(row);
        }
      }
      return rows;
    },
  },
};
