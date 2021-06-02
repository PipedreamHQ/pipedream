const airtable = require("../../airtable.app.js");
const chunk = require("lodash.chunk");

const BATCH_SIZE = 10; // Airtable API allows to update up to 10 rows per request.

module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table by passing an array of objects containing field names and values as key/value pairs.",
  version: "0.0.30",
  type: "action",
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
    records: {
      propDefinition: [
        airtable,
        "records",
      ],
    },
    typecast: {
      propDefinition: [
        airtable,
        "typecast",
      ],
    },
  },
  async run() {
    const table = this.airtable.api(this.baseId, this.tableId);

    let data = this.records;
    if (!Array.isArray(data)) {
      data = JSON.parse(data);
    }
    data = data.map((fields) => ({
      fields,
    }));

    const params = {
      typecast: this.typecast,
    };

    const requests = chunk(data, BATCH_SIZE)
      .map((data) => table.create(data, params));

    return await Promise.all(requests);
  },
};
