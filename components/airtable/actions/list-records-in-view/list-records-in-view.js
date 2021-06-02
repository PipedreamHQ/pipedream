const airtable = require("../../airtable.app.js");

module.exports = {
  key: "airtable-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records in a view with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.0.9",
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
    viewId: {
      type: "$.airtable.viewId",
      tableIdProp: "tableId",
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

    const config = {
      view: this.viewId,
    };
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
