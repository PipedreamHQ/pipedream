const chunk = require("lodash.chunk");
const airtable = require("../../airtable.app.js");
const common = require("../common.js");

const BATCH_SIZE = 10; // The Airtable API allows us to update up to 10 rows per request.

module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table by passing an array of objects containing field names and values as key/value pairs.",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
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
    const table = this.airtable.base(this.baseId)(this.tableId);

    let data = this.records;
    if (!Array.isArray(data)) {
      data = JSON.parse(data);
    }
    data = data.map((fields) => ({
      fields,
    }));
    if (!data.length) {
      throw new Error("No Airtable record data passed to step. Please pass at least one record");
    }

    const params = {
      typecast: this.typecast,
    };

    const responses = [];
    for (const c of chunk(data, BATCH_SIZE)) {
      try {
        responses.push(...(await table.create(c, params)));
      } catch (err) {
        this.airtable.throwFormattedError(err);
      }
    }

    return responses;
  },
};
