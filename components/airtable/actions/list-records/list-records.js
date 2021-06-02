const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-list-records",
  name: "List Records",
  description: "Retrieve records from a table with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.0.32",
  props: {
    airtable,
    baseId: {
      type: "$.airtable.baseId",
      appProp: "airtable",
    },
    tableId: {
      type: "$.airtable.tableId",
      baseIdProp: "baseId",
    },
    sortFieldId: {
      propDefinition: [
        airtable,
        "sortFieldId",
      ],
    },
    sortDirection: {
      propDefinition: [
        airtable,
        "sortDirection",
      ],
    },
    maxRecords: {
      propDefinition: [
        airtable,
        "maxRecords",
      ],
    },
    filterByFormula: {
      propDefinition: [
        airtable,
        "filterByFormula",
      ],
    },
  },
  async run() {
    const table = this.airtable.api(this.baseId, this.tableId);

    const config = {};
    if (this.filterByFormula) {
      config.filterByFormula = this.filterByFormula;
    }
    if (this.maxRecords) {
      config.maxRecords = this.maxRecords;
    }
    if (this.sortFieldId && this.sortDirection) {
      config.sort = [
        {
          field: this.sortFieldId,
          direction: this.sortDirection,
        },
      ];
    }

    const data = await table.select(config).all();

    return data.map((record) => record._rawJson);
  },
};
