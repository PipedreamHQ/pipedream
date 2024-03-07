import tento8 from "../../tento8.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "tento8-book-appointment",
  name: "Book Appointment",
  description: "Books a time slot for an appointment with optional attendee count and location. [See the documentation](https://app.10to8.com/api/booking/v2/book/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    tento8,
    time: {
      propDefinition: [
        tento8,
        "time",
      ],
    },
    attendeeCount: {
      propDefinition: [
        tento8,
        "attendeeCount",
        (c) => ({
          maxAttendees: c.attendeeCount,
        }),
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        tento8,
        "location",
        (c) => ({
          locationUri: c.location,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.tento8.bookAppointment({
      startDatetime: this.time,
      service: undefined,
      customerName: undefined,
      customerEmail: undefined,
      customerPhone: undefined,
      customerPhoneCountry: undefined,
      customerTimezone: undefined,
      staff: undefined,
      location: this.location,
      attendeeCount: this.attendeeCount,
      answers: undefined,
    });

    $.export("$summary", `Successfully booked appointment with ID: ${response.id}`);
    return response;
  },
};
