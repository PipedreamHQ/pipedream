import common from "./common-webhook.mjs";
import retry from "async-retry";

export default {
  ...common,
  methods: {
    ...common.methods,
    getDataTypes() {
      return [
        "tableData",
      ];
    },
    withRetries(apiCall, retries = 3) {
      return retry(async (bail) => {
        try {
          return await apiCall();
        } catch (err) {
          return bail(err);
        }
      }, {
        retries,
      });
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

      let updateType = operation === "createdRecordsById"
        ? "created"
        : "updated";

      let fields = {};
      try {
        ({ fields } = await this.withRetries(() => this.airtable.getRecord({
          baseId: this.baseId,
          tableId,
          recordId,
        })));
      } catch (e) {
        fields = {};
      }

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
