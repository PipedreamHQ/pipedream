import app from "../../ironclad.app.mjs";

export default {
  key: "ironclad-delete-record",
  name: "Delete Record",
  description: "Permanently deletes an Ironclad repository record by ID."
    + " **When the record ID isn't known**, use **Search Records** first to find it."
    + " This action cannot be undone."
    + " [See the documentation](https://developer.ironcladapp.com/reference/delete-a-record)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to delete.",
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteRecord({
      $,
      recordId: this.recordId,
    });

    $.export("$summary", `Deleted record ${this.recordId}`);
    return response ?? {
      success: true,
      recordId: this.recordId,
    };
  },
};
