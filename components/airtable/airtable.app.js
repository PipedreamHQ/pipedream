module.exports = {
  type: "app",
  app: "airtable",
  propDefinitions: {
    filterByFormula: {
      type: "string",
      label: "Filter by Formula",
      description: "Optionally provide a [formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, pass `NOT({Name} = '')`.",
      optional: true,      
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
    record: {
      type: "object",
      label: "Record",
      description: "Enter the column name for the key and the corresponding column value. You can include all, some, or none of the field values. You may also disable structured mode to pass a JSON object with key/value pairs representing columns and values."
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Enter a [record ID](https://support.airtable.com/hc/en-us/articles/360051564873-Record-ID) (eg. `recxxxxxxx`).",   
    },
    records: {
      type: "any",
      label: "Records",
      description: 'Enter an array of objects or a reference to a previous step export enclosed in double-curly brackets `{{...}}` (e.g., `{{[{"field1":"value","field2":"value"},{"field1":"value","field2":"value"}]}}` or `{{steps.foo.$return_value}}`). Each object should represent a row with the column name as the key and the corresponding value. You can include all, some, or none of the fields.'
    },
    sortDirection: { 
      type: "string", 
      label: "Sort: Direction",
      description: "This field will be ignored if you don't select a field to sort by.",
      options: [
        { label: "Descending", value: "desc", },
        { label: "Ascending", value: "asc" }
      ], 
      default: "desc",
      optional: true
    },
    sortFieldId: { 
      type: "$.airtable.fieldId",
      tableIdProp: "tableId", 
      label: "Sort: Field",
      description: "Optionally select a field to sort results. To sort by multiple fields, use the `Filter by Forumla` field.",
      optional: true,
    },
  }
}
