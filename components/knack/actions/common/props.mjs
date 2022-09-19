// Props used by some Knack actions
const recordId = {
  type: "string",
  label: "Record ID",
  description: `The ID of the record.
    \\
    See [the Knack API docs](https://docs.knack.com/docs/finding-record-ids) for more information.`,
};
const optionalRecordId = {
  type: "string",
  label: "Record ID",
  optional: true,
  description: `The ID of the record to retrieve.
    \\
    If not specified, all records for the specified object will be retrieved.
    \\
    See [the Knack API docs](https://docs.knack.com/docs/finding-record-ids) for more information.`,
};
const recordData = {
  type: "object",
  label: "Record Data",
  description: `The record fields to be updated and their new values.
    \\
    See [the Knack API docs](https://docs.knack.com/docs/working-with-fields) for more information.`,
};

export {
  recordId, optionalRecordId, recordData,
};
