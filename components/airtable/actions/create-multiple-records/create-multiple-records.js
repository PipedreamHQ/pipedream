const airtable = require("../../airtable.app.js");
const chunk = require("lodash.chunk");
const common = require("../common.js");

module.exports = {
  key: "airtable-create-multiple-records",
  name: "Create Multiple Records",
  description: "Create one or more records in a table by passing an array of objects containing field names and values as key/value pairs.",
  version: "0.1.0",
  type: "action",
  props: {
    ...common.props,
    records: {
      propDefinition: [
        airtable,
        "records",
      ],
    },
  },
  methods: {
    async addRecords(records) {
      const base = this.airtable.base(this.baseId);
      return await base(this.tableId).create(records);
    },
  },
  async run() {
    let responseRecords = [];
    const BATCH_SIZE = 10; // The Airtable API allows us to update up to 10 rows per request.

    let inputRecords = this.records;

    if (!Array.isArray(inputRecords)) {
      inputRecords = JSON.parse(inputRecords);
    }

    if (!inputRecords.length) {
      throw new Error("No Airtable record data passed to step. Please pass at least one record");
    }

    const records = inputRecords.map((record) => ({
      fields: record,
    }));

    const chunkedRecords = chunk(records, BATCH_SIZE);
    for (const chunk of chunkedRecords) {
      try {
        responseRecords = responseRecords.concat((await this.addRecords(chunk)));
      } catch (err) {
        this.airtable.throwFormattedError(err);
      }
    }

    return responseRecords;
  },
};
