import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-get-availability-times",
  name: "Get Availability Times",
  description: "Return available times for a date and appointment type. [See the documentation](https://developers.acuityscheduling.com/reference/get-availability-times)",
  version: "0.0.2",
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
      description: "Date to get availability times for. E.g. `2016-02-03`",
    },
    appointmentTypeId: {
      propDefinition: [
        acuityScheduling,
        "appointmentTypeId",
      ],
      description: "Appointment type to get availability times for",
    },
    calendarId: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
      description: "Calendar to get availability times for",
      optional: true,
    },
    timezone: {
      propDefinition: [
        acuityScheduling,
        "timezone",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.acuityScheduling.getAvailabilityTimes({
      $,
      params: {
        date: this.date,
        appointmentTypeID: this.appointmentTypeId,
        calendarID: this.calendarId,
        timezone: this.timezone,
      },
    });
    $.export("$summary", `Successfully retrieved availability times for ${this.date}`);
    return response;
  },
};
