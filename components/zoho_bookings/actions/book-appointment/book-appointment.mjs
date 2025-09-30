import app from "../../zoho_bookings.app.mjs";
import FormData from "form-data";
import { ConfigurationError } from "@pipedream/platform";
import { TIME_ZONES } from "../common/constants.mjs";

export default {
  key: "zoho_bookings-book-appointment",
  name: "Book Appointment",
  description: "Book an appointment for a customer for a desired service. [See the documentation](https://www.zoho.com/bookings/help/api/v1/book-appointment.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
    },
    staffId: {
      propDefinition: [
        app,
        "staffId",
      ],
    },
    resourceId: {
      propDefinition: [
        app,
        "resourceId",
      ],
    },
    fromTime: {
      type: "string",
      label: "From Time",
      description: "The starting time from which the appointment needs to be booked. (24-hour time format) format: `dd-MMM-yyyy HH:mm:ss` (e.g. 30-Apr-2019 22:00:00)",
    },
    customerDetails: {
      type: "object",
      label: "Customer Details",
      description: "The details of the customer for the appointment",
      default: {
        "name": "",
        "email": "",
        "phone_number": "",
      },
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "The time zone of the appointment",
      options: TIME_ZONES,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("service_id", this.serviceId);
    if (!this.staffId && !this.resourceId) {
      throw new ConfigurationError("Either `staff` or `resource` is mandatory");
    }
    if (this.staffId) {
      data.append("staff_id", this.staffId);
    }
    if (this.resourceId) {
      data.append("resource_id", this.resourceId);
    }
    data.append("from_time", this.fromTime);
    data.append("customer_details", JSON.stringify(this.customerDetails));
    if (this.timeZone) {
      data.append("time_zone", this.timeZone);
    }
    const { response } = await this.app.bookAppointment({
      $,
      data,
      headers: {
        ...data.getHeaders(),
      },
    });

    if (response?.returnvalue?.status === "failure") {
      throw new Error(response?.returnvalue?.message);
    }
    $.export("$summary", `Successfully persisted an appointment with ID: ${response?.returnvalue?.booking_id}`);
    return response;
  },
};
