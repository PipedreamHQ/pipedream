import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-delete-time-entry",
  name: "Delete Time Entry",
  description: "Permanently delete a time entry. Use **List Time Entries** to find a valid ID. Example: call with timeEntryId set to a mistakenly logged entry's ID to remove it. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#delete-a-time-entry).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    timeEntryId: {
      propDefinition: [
        harvest,
        "timeEntryId",
      ],
    },
  },
  async run({ $ }) {
    await this.harvest.deleteTimeEntry({
      $,
      id: this.timeEntryId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully deleted time entry ${this.timeEntryId}`);
  },
};
