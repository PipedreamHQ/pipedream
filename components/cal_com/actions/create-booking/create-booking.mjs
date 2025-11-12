import { ConfigurationError } from "@pipedream/platform";
import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-create-booking",
  name: "Create Booking",
  description: "Create a new booking. [See the documentation](https://developer.cal.com/api/api-reference/bookings#create-a-new-booking)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    calCom,
    eventTypeId: {
      propDefinition: [
        calCom,
        "eventTypeId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the person the booking is with",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the person the booking is with",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new booking",
      optional: true,
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the new booking in **ISO 8601** format. E.g. `2025-04-21T20:28:00`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the new booking in **ISO 8601** format. E.g. `2025-04-21T20:28:00`",
    },
    recurringCount: {
      type: "integer",
      label: "Recurring Count",
      description: "Number of times the booking should repeat",
      optional: true,
    },
    language: {
      propDefinition: [
        calCom,
        "language",
      ],
    },
    timeZone: {
      propDefinition: [
        calCom,
        "timeZone",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      eventTypeId: this.eventTypeId,
      name: this.name,
      email: this.email,
      title: this.title,
      start: this.startTime,
      end: this.endTime,
      recurringCount: this.recurringCount,
      language: this.language,
      timeZone: this.timeZone,
      location: "",
      customInputs: [],
      metadata: {},
    };
    try {
      const response = await this.calCom.createBooking({
        data,
        $,
      });
      $.export("$summary", `Successfully created booking with ID ${response.id}`);
      return response;
    } catch (error) {
      const errorJson = JSON.parse(error.slice(error.indexOf("{")));
      const message = errorJson?.data?.message;
      throw new ConfigurationError(`Error: ${message}${message === "no_available_users_found_error"
        ? ". No users are available to be assigned to a booking at the specified time"
        : ""}`);
    }
  },
};
