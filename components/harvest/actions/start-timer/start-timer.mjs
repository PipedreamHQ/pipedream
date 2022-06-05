import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-start-timer",
  name: "Start Time Entry",
  description: "Restart a stopped timer entry. [See docs here](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/#restart-a-stopped-time-entry)",
  version: "0.0.1",
  type: "action",
  props: {
    harvest,
    timeEntryId: {
      propDefinition: [
        harvest,
        "timeEntryId",
        () => ({
          isRunning: false,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.restartTimeEntry({
      $,
      id: this.timeEntryId,
    });
    response && $.export("$summary", "Successfully started the time entry");
    return response;
  },
};
