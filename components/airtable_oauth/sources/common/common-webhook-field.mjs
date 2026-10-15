import common from "./common-webhook.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    getDataTypes() {
      return [
        "tableFields",
      ];
    },
    async saveAdditionalData() {
      const tableData = await this.airtable.listTables({
        baseId: this.baseId,
      });
      const filteredData = tableData?.tables?.map(({
        id, name, fields,
      }) => ({
        id,
        name,
        fields,
      }));
      if (filteredData?.length) {
        this.db.set("tableSchemas", filteredData);
      }
    },
    async emitEvent(payload) {
      const changed = payload?.changedTablesById;
      const tableEntry = changed && Object.entries(changed)[0];
      if (!tableEntry) {
        // Unknown / empty shape — emit normalized raw so consumers still get a consistent shape
        this.$emit({
          originalPayload: payload,
        }, this.generateMeta(payload));
        return;
      }
      const [
        tableId,
        tableData,
      ] = tableEntry;
      const [
        operation,
        fieldObj,
      ] = Object.entries(tableData)[0];
      const [
        fieldId,
        fieldUpdateInfo,
      ] = Object.entries(fieldObj)[0];

      const timestamp = Date.parse(payload.timestamp);
      if (this.isDuplicateEvent(fieldId, timestamp)) return;
      this._setLastObjectId(fieldId);
      this._setLastTimestamp(timestamp);

      const updateType = operation === "createdFieldsById"
        ? "created"
        : "updated";

      let table = {
        id: tableId,
      };
      let field = {
        id: fieldId,
      };

      const tableSchemas = this.db.get("tableSchemas");
      if (tableSchemas) {
        table = tableSchemas.find(({ id }) => id === tableId);
        field = table?.fields.find(({ id }) => id === fieldId);
        delete table.fields;
      }

      const summary = `Field ${updateType}: ${field.name ?? fieldUpdateInfo?.name ?? field.id}`;

      this.$emit({
        originalPayload: payload,
        table,
        field,
        fieldUpdateInfo,
      }, this.generateMeta(payload, summary));
    },
  },
};
