import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-get-appointments",
  name: "Get Appointments",
  description: "Return a list of appointments. [See the documentation](https://developers.acuityscheduling.com/reference/get-appointments)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acuityScheduling,
    minDate: {
      type: "string",
      label: "Min Date",
      description: "Show appointments after this date (YYYY-MM-DD)",
      optional: true,
    },
    maxDate: {
      type: "string",
      label: "Max Date",
      description: "Show appointments before this date (YYYY-MM-DD)",
      optional: true,
    },
    calendarId: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
      optional: true,
    },
    appointmentTypeId: {
      propDefinition: [
        acuityScheduling,
        "appointmentTypeId",
      ],
      optional: true,
    },
    canceled: {
      type: "boolean",
      label: "Canceled",
      description: "Show only canceled appointments",
      optional: true,
    },
    showall: {
      type: "boolean",
      label: "Show All",
      description: "Show both canceled and scheduled appointments",
      optional: true,
    },
    excludeForms: {
      type: "boolean",
      label: "Exclude Forms",
      description: "Don't include intake forms in the response object (speeds up the response)",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by client email address",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Filter by client first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Filter by client last name",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter by client phone number",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of appointments to return",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Sort direction",
      options: [
        "ASC",
        "DESC",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const appointments = await this.acuityScheduling.listAppointments({
      $,
      params: {
        minDate: this.minDate,
        maxDate: this.maxDate,
        calendarID: this.calendarId,
        appointmentTypeID: this.appointmentTypeId,
        canceled: this.canceled,
        showall: this.showall,
        excludeForms: this.excludeForms,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        max: this.max,
        direction: this.direction,
      },
    });
    $.export("$summary", `Returned ${appointments.length} appointments.`);
    return appointments;
  },
};
