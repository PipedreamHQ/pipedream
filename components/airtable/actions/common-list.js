// Shared code for list-* actions
const airtable = require("../airtable.app.js");

module.exports = {
  props: {
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
    const base = this.airtable.base(this.baseId);
    const data = [];
    const config = {};

    if (this.viewId) { config.view = this.viewId; }
    if (this.filterByFormula) { config.filterByFormula = this.filterByFormula; }
    if (this.maxRecords) { config.maxRecords = this.maxRecords; }
    if (this.sortFieldId && this.sortDirection) {
      config.sort = [
        {
          field: this.sortFieldId,
          direction: this.sortDirection,
        },
      ];
    }

    await base(this.tableId).select({
      ...config,
    })
      .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
        records.forEach(function(record) {
          data.push(record._rawJson);
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      });

    return data;
  },
};
