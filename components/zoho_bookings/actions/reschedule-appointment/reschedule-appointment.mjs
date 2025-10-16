import app from "../../zoho_bookings.app.mjs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "zoho_bookings-reschedule-appointment",
  name: "Reschedule Appointment",
  description: "Reschedule an appointment to a different time or to a different staff. [See the documentation](https://www.zoho.com/bookings/help/api/v1/reschedule-appointment.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    bookingId: {
      type: "string",
      label: "Booking Id",
      description: "The unique id of the previously booked appointment.",
    },
    staffId: {
      propDefinition: [
        app,
        "staffId",
      ],
      description: "The ID of the staff member for the appointment. Either staff or start time is mandatory",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The new time to which the appointment must be rescheduled. (24-hour time format) format: `dd-MMM-yyyy HH:mm:ss` (e.g. 30-Apr-2019 22:00:00)",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("booking_id", this.bookingId);
    if (!this.staffId && !this.startTime) {
      throw new ConfigurationError("Either `staff` or `start time` is mandatory");
    }
    if (this.staffId) {
      data.append("staff_id", this.staffId);
    }
    if (this.startTime) {
      data.append("start_time", this.startTime);
    }
    const { response } = await this.app.rescheduleAppointment({
      $,
      data,
      headers: {
        ...data.getHeaders(),
      },
    });

    if (response?.returnvalue?.status === "failure") {
      throw new Error(response?.returnvalue?.message);
    }
    $.export("$summary", `Successfully rescheduled the appointment with ID: ${response.returnvalue.booking_id}`);
    return response;
  },
};
