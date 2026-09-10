import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-delete-clock-entry",
  name: "Delete Clock Entry",
  description: "Permanently delete a clock entry (DELETE /time-tracking/clock-entries/{id}). Idempotent (returns 204); returns 409 if the entry belongs to an approved timesheet or is still open. Use **List Clock Entries** to find IDs. [See the documentation](https://documentation.bamboohr.com/reference/delete-clock-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bamboohr,
    clockEntryId: {
      propDefinition: [
        bamboohr,
        "clockEntryId",
      ],
      description: "The clock entry ID to delete, e.g. `321`. Run **List Clock Entries** to discover IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.deleteClockEntry({
      $,
      clockEntryId: this.clockEntryId,
    });
    $.export("$summary", `Deleted clock entry ${this.clockEntryId}`);
    return response;
  },
};
