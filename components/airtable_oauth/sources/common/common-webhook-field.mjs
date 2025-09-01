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
      const [
        tableId,
        tableData,
      ] = Object.entries(payload.changedTablesById)[0];
      const [
        operation,
        fieldObj,
      ] = Object.entries(tableData)[0];
      const [
        fieldId,
        fieldUpdateInfo,
      ] = Object.entries(fieldObj)[0];

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
