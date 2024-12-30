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
      const [
        tableId,
        tableData,
      ] = Object.entries(payload.changedTablesById)[0];
      let [
        operation,
        recordObj,
      ] = Object.entries(tableData)[0];
      if (operation === "changedViewsById") {
        const changedRecord = Object.entries(recordObj)[0];
        operation = changedRecord[0];
        recordObj = changedRecord[1];
      }

      // for deleted record(s) we'll emit only their ids (no other info is available)
      if (operation === "destroyedRecordIds" && Array.isArray(recordObj)) {
        const { length } = recordObj;
        const summary = length === 1
          ? `Record deleted: ${recordObj[0]}`
          : `${length} records deleted`;
        this.$emit({
          originalPayload: payload,
          tableId,
          deletedRecordIds: recordObj,
        }, this.generateMeta(payload, summary));
        return;
      }

      const [
        recordId,
        recordUpdateInfo,
      ] = Object.entries(recordObj)[0];

      const timestamp = Date.parse(payload.timestamp);
      if (this.isDuplicateEvent(recordId, timestamp)) return;
      this._setLastObjectId(recordId);
      this._setLastTimestamp(timestamp);

      let updateType = operation === "createdRecordsById"
        ? "created"
        : "updated";

      const { fields } = await this.airtable.getRecord({
        baseId: this.baseId,
        tableId,
        recordId,
      });

      const summary = `Record ${updateType}: ${fields?.name ?? recordId}`;

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
