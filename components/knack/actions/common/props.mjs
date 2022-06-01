// Props used by some (but not all) Knack actions
const recordId = {
  type: "string",
  label: "Record ID",
  description: `The ID of the record.
    \\
    For more info, see [the Knack API docs.](https://docs.knack.com/docs/finding-record-ids)`,
};
export default {
  recordId,
  optionalRecordId: {
    ...recordId,
    optional: true,
    description: `The ID of the record to retrieve.
    \\
    If not specified, all records for the specified object will be retrieved.
    \\
    For more info, see [the Knack API docs.](https://docs.knack.com/docs/finding-record-ids)`,
  },
  recordData: {
    type: "object",
    label: "Record Data",
    description: `The record fields to be updated and their new values.
      \\
      For more info, see [the Knack API docs.](https://docs.knack.com/docs/working-with-fields)`,
  },
};
