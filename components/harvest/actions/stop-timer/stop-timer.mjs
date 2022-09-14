import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-stop-timer",
  name: "Stop Time Entry",
  description: "Stop a timer entry. [See docs here](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#stop-a-running-time-entry)",
  version: "0.0.1",
  type: "action",
  props: {
    harvest,
    timeEntryId: {
      propDefinition: [
        harvest,
        "timeEntryId",
        () => ({
          isRunning: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.stopTimeEntry({
      $,
      id: this.timeEntryId,
    });
    response && $.export("$summary", "Successfully ended the time entry");
    return response;
  },
};
