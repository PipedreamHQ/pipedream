import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-time-entry",
  name: "Get Time Entry",
  description: "Retrieve a single time entry by ID. Use **List Time Entries** to find a valid ID. Example: call with timeEntryId set to a known entry's ID to see its hours, project, and task. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#retrieve-a-time-entry).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
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
    const response = await this.harvest.getTimeEntry({
      $,
      id: this.timeEntryId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved time entry ${response.id}`);
    return response;
  },
};
