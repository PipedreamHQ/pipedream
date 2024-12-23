
import common from "./common-webhook.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getDataTypes() {
      return [
        "tableData",
      ];
    },
    async emitEvent(payload) {
      const [tableId, tableData] = Object.entries(payload.changedTablesById)[0];
      let [operation, recordObj] = Object.entries(tableData)[0];
      if (operation === 'changedViewsById') {
        const changedRecord = Object.entries(recordObj)[0];
        operation = changedRecord[0];
        recordObj = changedRecord[1];
      }
      const [recordId, recordUpdateInfo] = Object.entries(recordObj)[0];

      let updateType = 'updated';
      if (operation === "createdRecordsById") {
        updateType = "created";
      } else if (operation === "deletedRecordsById") {
        updateType = "deleted";
      }

      const { fields } = await this.airtable.getRecord({
        baseId: this.baseId,
        tableId,
        recordId
      });

      const summary = `Record ${updateType}: ${fields?.name ?? recordId}`

      this.$emit({
        originalPayload: payload,
        tableId,
        record: {
          id: recordId,
          fields,
        },
        recordUpdateInfo,
      }, this.generateMeta(payload, summary));
    },
  },
};
