// x-pd-ai: optimized
import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-delete-record",
  name: "Delete Record",
  description: "Permanently deletes an Ironclad record by ID. This cannot be undone. Run **Search Records** first to find the `recordId` — confirm it's the right record before deleting, since Ironclad has no undo. Example: set `recordId` to `\"rec_abc123\"` to delete that record; the action confirms deletion succeeded. [See the documentation](https://developer.ironcladapp.com/reference/delete-a-record)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ironclad,
    recordId: {
      propDefinition: [
        ironclad,
        "recordId",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    await this.ironclad.deleteRecord({
      $,
      recordId: this.recordId,
    });
    $.export("$summary", `Deleted record ${this.recordId}`);
    return {
      recordId: this.recordId,
      deleted: true,
    };
  },
};
