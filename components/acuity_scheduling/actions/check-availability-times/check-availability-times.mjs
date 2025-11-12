import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-check-availability-times",
  name: "Check Availability Times",
  description: "Validate available times for an appointment. [See the documentation](https://developers.acuityscheduling.com/reference/availability-check-times)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acuityScheduling,
    date: {
      type: "string",
      label: "Date",
      description: "Date to check availability for. E.g. `2016-02-03T14:00:00-0800`",
    },
    appointmentTypeId: {
      propDefinition: [
        acuityScheduling,
        "appointmentTypeId",
      ],
      description: "Appointment type to check availability time for",
    },
    calendarId: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
      description: "Calendar to check availability time for",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acuityScheduling.checkAvailabilityTimes({
      $,
      data: {
        datetime: this.date,
        appointmentTypeID: this.appointmentTypeId,
        calendarID: this.calendarId,
      },
    });
    $.export("$summary", `Successfully checked availability for ${this.date}`);
    return response;
  },
};
