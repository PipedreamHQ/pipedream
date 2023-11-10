import constants from "../../common/constants.mjs";
import app from "../../productiveio.app.mjs";

export default {
  key: "productiveio-create-booking",
  name: "Create Booking",
  description: "Creates a new booking in Productive. [See the documentation](https://developer.productive.io/bookings.html#bookings-bookings-post)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    personId: {
      propDefinition: [
        app,
        "personId",
      ],
    },
    startedOn: {
      type: "string",
      label: "Started On",
      description: "The start date of the booking. Eg. `2020-01-01`",
    },
    endedOn: {
      type: "string",
      label: "Ended On",
      description: "The end date of the booking. Eg. `2020-03-01`",
    },
    time: {
      type: "integer",
      label: "Time",
      description: "The time for the booking, Eg. `60`",
    },
    bookingMethodId: {
      type: "integer",
      label: "Booking Method ID",
      description: "The booking method ID: `1` means hours per day, time attribute needs to be set; 2: percentage per day, percentage attribute needs to be set; 3: total time",
      options: Object.values(constants.BOOKING_METHOD_ID),
      realoadProps: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note for the booking",
      optional: true,
    },
  },
  additionalProps() {
    const { bookingMethodId } = this;

    const percentage = {
      type: "string",
      label: "Percentage",
      description: "Percentage of working hours, required if *Booking Method ID* is set to *Percentage Per Day*.",
      options: Object.values(constants.PERCENTAGE),
    };

    if (bookingMethodId === constants.BOOKING_METHOD_ID.PERCENTAGE_PER_DAY.value) {
      return {
        percentage,
      };
    }

    return {
      percentage: {
        ...percentage,
        optional: true,
      },
    };
  },
  methods: {
    createBooking(args = {}) {
      return this.app.post({
        path: "/bookings",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createBooking,
      personId,
      startedOn,
      endedOn,
      time,
      bookingMethodId,
      note,
      percentage,
    } = this;

    const response = await createBooking({
      $,
      params: {
        person_id: personId,
        started_on: startedOn,
        ended_on: endedOn,
        time,
        booking_method_id: bookingMethodId,
        note,
        percentage,
      },
    });

    $.export("$summary", `Successfully created a new booking with ID \`${response.data.id}\``);
    return response;
  },
};
