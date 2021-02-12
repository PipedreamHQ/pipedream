module.exports = {
  type: "app",
  app: "airtable",
  propDefinitions: {
    record: {
      type: "object",
      label: "Record",
      description: "Enter the column name for the key and the corresponding column value. You can include all, some, or none of the field values. You may also disable structured mode to pass a JSON object with key/value pairs representing columns and values."
    },
    records: {
      type: "any",
      label: "Records",
      description: 'Enter an array of objects (e.g., `[{"FieldName1":"value","fieldName2":"value"},{"fieldName1":"value","fieldName2":"value"}]`). Each object should represent a row with the column name as the key and the value to insert as the corresponding value. You can include all, some, or none of the field values. To pass data from another step, enter a reference using double curly brackets (e.g., `{{steps.mydata.$return_value}}`).'
    },
  }
}
