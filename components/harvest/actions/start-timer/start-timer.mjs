import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-start-timer",
  name: "Start Time Entry",
  description: "Restart a stopped timer entry. [See docs here](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#restart-a-stopped-time-entry)",
  version: "0.0.3",
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
          isRunning: false,
          accountId: c.accountId,
        }),
      ],
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
