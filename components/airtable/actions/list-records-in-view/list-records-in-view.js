const airtable = require('../../airtable.app.js')
const axios = require('axios')

module.exports = {  
  key: "airtable-list-records-in-view",
  name: "List Records in View",
  type: "action",
  version: "0.0.1",
  props: {
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
    viewId: { type: "$.airtable.viewId", tableIdProp: "tableId" },
    filterByFormula: { propDefinition: [airtable, "filterByFormula"]},
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "The maximum total number of records that will be returned in your requests. Leave blank to retrieve all records.",
      optional: true,
    },
    // sortFieldId: { 
    //   type: "$.airtable.fieldId",
    //   tableIdProp: "tableId", 
    // },
    // sortDirection: { 
    //   type: "string", 
    //   label: "Sort Direction",
    //   options: [
    //     { label: "Descending", value: "desc", },
    //     { label: "Ascending", value: "asc" }
    //   ], 
    //   optional: true
    // },
  },
  async run() {
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: this.airtable.$auth.api_key}).base(this.baseId);
    const data = []
    const config = {}

    config.view = this.viewId
    if (this.filterByFormula) { config.filterByFormula = this.filterByFormula }
    if (this.maxRecords) { config.maxRecords = this.maxRecords }
    if (this.sortFieldId && this.sortDirection) {
      config.sort = [{field: this.sortFieldId, direction: this.sortDirection}]
    }

    await base(this.tableId).select({
        ...config,
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
         records.forEach(function(record) {
             data.push(record._rawJson)
         });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    })

    return data
  },
}