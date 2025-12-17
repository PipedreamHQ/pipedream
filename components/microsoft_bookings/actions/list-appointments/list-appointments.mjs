import app from "../../microsoft_bookings.app.mjs";

export default {
  key: "microsoft_bookings-list-appointments",
  name: "List Appointments",
  description: "Lists appointments in a specified date range for a Microsoft Bookings business. [See the documentation](https://learn.microsoft.com/en-us/graph/api/bookingbusiness-list-calendarview?view=graph-rest-1.0)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date and time for the calendar view in ISO 8601 format (e.g., `2024-05-01T00:00:00Z`)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date and time for the calendar view in ISO 8601 format (e.g., `2024-05-31T23:59:59Z`)",
    },
  },
  async run({ $ }) {
    const {
      app,
      businessId,
      startDate,
      endDate,
    } = this;

    const response = await app.getCalendarView({
      businessId,
      start: startDate,
      end: endDate,
    });

    const appointments = response.value || [];

    $.export("$summary", `Successfully retrieved ${appointments.length} appointment(s)`);

    return response;
  },
};
