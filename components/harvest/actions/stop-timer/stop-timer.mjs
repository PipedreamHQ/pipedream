import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-stop-timer",
  name: "Stop Time Entry",
  description: "Stop a timer entry. [See docs here](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#stop-a-running-time-entry)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
        (c) => ({
          isRunning: true,
          accountId: c.accountId,
        }),
      ],
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
