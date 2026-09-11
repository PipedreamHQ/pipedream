import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-delete-hour-entry",
  name: "Delete Hour Entry",
  description: "Permanently delete a time-tracking hour entry (DELETE /time-tracking/hour-entries/{id}). Idempotent (returns 204); returns 409 if the entry belongs to an approved timesheet. Use **List Hour Entries** to find IDs. [See the documentation](https://documentation.bamboohr.com/reference/delete-hour-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  ai: "optimized",
  props: {
    bamboohr,
    hourEntryId: {
      propDefinition: [
        bamboohr,
        "hourEntryId",
      ],
      description: "The hour entry ID to delete, e.g. `654`. Run **List Hour Entries** to discover IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.deleteHourEntry({
      $,
      hourEntryId: this.hourEntryId,
    });
    $.export("$summary", `Deleted hour entry ${this.hourEntryId}`);
    return response;
  },
};
