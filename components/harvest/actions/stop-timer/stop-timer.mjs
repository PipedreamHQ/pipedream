import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-stop-timer",
  name: "Stop Time Entry",
  description: "Stop a currently running time entry. Use **List Time Entries** with Is Running set to true to find a running entry to stop. Example: call with timeEntryId set to a currently running entry's ID to stop the clock on it. [See the documentation](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#stop-a-running-time-entry).",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
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
      description: "Free-form ID of a running time entry to stop, e.g. `636708723`. Run **List Time Entries** with Is Running set to true to find valid IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.harvest.stopTimeEntry({
      $,
      id: this.timeEntryId,
      accountId: this.accountId,
    });
    response && $.export("$summary", "Successfully ended the time entry");
    return response;
  },
};
