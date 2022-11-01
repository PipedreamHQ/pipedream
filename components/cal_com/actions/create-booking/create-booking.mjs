import calCom from "../../cal_com.app.mjs";

export default {
  key: "cal_com-create-booking",
  name: "Create Booking",
  description: "Create a new booking. [See the docs here](https://developer.cal.com/api/api-reference/bookings#create-a-new-booking)",
  version: "0.0.1",
  type: "action",
  props: {
    calCom,
    eventType: {
      propDefinition: [
        calCom,
        "eventType",
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
      description: "The start time of the new booking in **ISO 8601** format",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the new booking in **ISO 8601** format",
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
      eventTypeId: this.eventType,
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
    const response = await this.calCom.createBooking({
      data,
      $,
    });
    $.export("$summary", `Successfully created booking with ID ${response.id}`);
    return response;
  },
};
