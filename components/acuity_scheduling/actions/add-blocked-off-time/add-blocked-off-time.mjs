import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-add-blocked-off-time",
  name: "Add Blocked Off Time",
  description: "Blocks a specific time slot on your schedule to prevent the scheduling of any appointments during this particular time range. [See the documentation](https://developers.acuityscheduling.com/reference/post-blocks)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    acuityScheduling,
    startTime: {
      propDefinition: [
        acuityScheduling,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        acuityScheduling,
        "endTime",
      ],
    },
    calendarId: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any notes to include for the blocked off time",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acuityScheduling.blockTime({
      $,
      data: {
        start: this.startTime,
        end: this.endTime,
        calendarID: this.calendarId,
        notes: this.notes,
      },
    });

    $.export("$summary", `Successfully blocked off time from ${this.startTime} to ${this.endTime}`);
    return response;
  },
};
