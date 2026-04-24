import { ConfigurationError } from "@pipedream/platform";
import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-create-booking",
  name: "Create Booking",
  description: "Create a new booking. [See the documentation](https://cal.com/docs/api-reference/v2/bookings/create-a-booking)",
  version: "0.0.7",
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
    attendeeName: {
      type: "string",
      label: "Attendee Name",
      description: "Full name of the attendee",
    },
    attendeeEmail: {
      type: "string",
      label: "Attendee Email",
      description: "Email address of the attendee",
    },
    attendeeTimeZone: {
      propDefinition: [
        calCom,
        "timeZone",
      ],
    },
    attendeeLanguage: {
      propDefinition: [
        calCom,
        "language",
      ],
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Time (UTC)",
      description: "Start time in ISO 8601 UTC format, e.g. `2024-08-13T09:00:00Z`",
    },
  },
  async run({ $ }) {
    if (!this.start.endsWith("Z")) {
      throw new ConfigurationError(
        "Start time must be in UTC format and end with 'Z'.",
      );
    }
    const data = {
      eventTypeId: this.eventTypeId,
      start: this.start,
      attendee: {
        name: this.attendeeName,
        email: this.attendeeEmail,
        timeZone: this.attendeeTimeZone,
        ...(this.attendeeLanguage && {
          language: this.attendeeLanguage,
        }),
      },
    };
    const response = await this.calCom.createBooking({
      data,
      $,
    });
    const bookingId = response?.data?.id;
    $.export(
      "$summary",
      bookingId
        ? `Successfully created booking with ID: ${bookingId}`
        : "Successfully created booking",
    );
    return response;
  },
};
