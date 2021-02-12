const airtable = require('../../airtable.app.js')
const axios = require('axios')

module.exports = {  
  key: "airtable-list-records",
  name: "List Records",
  type: "action",
  version: "0.0.2",
  props: {
    airtable,
    baseId: { type: "$.airtable.baseId", appProp: "airtable" },
    tableId: { type: "$.airtable.tableId", baseIdProp: "baseId" },
    filterByFormula: {
      type: "string",
      label: "Filter by Formula",
      description: "A formula used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response",
      optional: true,      
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "The maximum total number of records that will be returned in your requests. If this value is larger than `pageSize` (which is 100 by default), you may have to load multiple pages to reach this total",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of records returned in each request. Must be less than or equal to 100. Default is 100",
      optional: true,
    },
    offset: {
      type: "string",
      label: "Offset",
      description: "If there are more records, the response will contain an `offset`. To fetch the next page of records, include `offset` in the next request's parameters",
      optional: true,      
    },
    sort: {
      type: "boolean",
      label: "Sort",
      description: " list of sort objects that specifies how the records will be ordered. Each sort object must have a field key specifying the name of the field to sort on, and an optional direction key that is either `asc` or `desc`. The default direction is `asc`",
      optional: true,      
    }
  },
  async run() {
    var sort = "";
    /*if(params.sort){
        var i = 0;        
        for (const s of params.sort) {        
          var prefix = i==0 ? "?" : "&";
          var sort_param = `${prefix}sort[${i}][field]=${s.field}&sort[${i}][direction]=${s.direction}`;
          sort = sort + sort_param;
          i++;
        }
    }*/

    const config = {
      url: `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(this.tableId)}${sort}`,
      params: {
        //fields: params.fields,
        filterByFormula: this.filterByFormula,
        maxRecords: this.maxRecords,
        pageSize: this.pageSize,    
        view: this.view,
        cellFormat: 'json',
        timeZone: this.timeZone,
        userLocale: this.userLocale,
        offset: this.offset,
      },
      headers: {
        Authorization: `Bearer ${this.airtable.$auth.api_key}`,
      },
    }
    return (await axios(config)).data.records
  },
}