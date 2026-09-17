import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-start-timer",
  name: "Start Time Entry",
  description: "Restart a stopped time entry so it resumes running. Use **List Time Entries** with Is Running set to false to find a stopped entry to restart. Example: call with timeEntryId set to a stopped entry's ID to resume tracking time on it. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#restart-a-stopped-time-entry).",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "Free-form ID of a stopped time entry to restart, e.g. `636708723`. Run **List Time Entries** with Is Running set to false to find valid IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.harvest.restartTimeEntry({
      $,
      id: this.timeEntryId,
      accountId: this.accountId,
    });
    response && $.export("$summary", "Successfully started the time entry");
    return response;
  },
};
