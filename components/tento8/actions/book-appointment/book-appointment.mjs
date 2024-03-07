import app from "../../tento8.app.mjs";

export default {
  key: "tento8-book-appointment",
  name: "Book Appointment",
  description: "Books a time slot for an appointment with optional attendee count and location. [See the documentation](https://app.10to8.com/api/booking/v2/book/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    startDatetime: {
      type: "string",
      label: "Start Date Time",
      description: "The ISO datetime string. You can include a timezone with either `Z` or `+00:00` formats. The default timezone is UTC. Eg `2024-02-05T14:30:00Z`",
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "Name of customer the booking is for.",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "The email address of the customer the booking is for. It is important this is correct, otherwise the customer will not be able to manage their appointment.",
    },
    customerTimezone: {
      type: "string",
      label: "Customer Timezone",
      description: "The timezone where the customer is based. If not included, defaults to the organisation timezone.",
      optional: true,
    },
    service: {
      propDefinition: [
        app,
        "service",
      ],
    },
    staff: {
      propDefinition: [
        app,
        "staff",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
  },
  methods: {
    bookAppointment(args = {}) {
      return this.app.post({
        path: "/book",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      bookAppointment,
      startDatetime,
      service,
      customerName,
      customerEmail,
      customerTimezone,
      staff,
      location,
    } = this;

    const response = await bookAppointment({
      $,
      data: {
        start_datetime: startDatetime,
        service,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_timezone: customerTimezone,
        staff,
        location,
      },
    });

    $.export("$summary", `Successfully booked appointment with ID \`${response.id}\``);
    return response;
  },
};
