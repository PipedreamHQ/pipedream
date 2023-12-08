import app from "../../productive_io.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "productive_io-create-booking",
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
    note: {
      type: "string",
      label: "Note",
      description: "A note for the booking",
      optional: true,
    },
    time: {
      type: "integer",
      label: "Time",
      description: "The time for the booking, Eg. `60`",
    },
    bookingMethodId: {
      type: "integer",
      label: "Booking Method ID",
      description: "The booking method ID: `1`: means hours per day, **Time** prop needs to be set; `2`: percentage per day, **Percentage** prop needs to be set; `3`: Total time",
      options: Object.values(constants.BOOKING_METHOD_ID),
      reloadProps: true,
    },
  },
  additionalProps() {
    const { bookingMethodId } = this;

    if (bookingMethodId === constants.BOOKING_METHOD_ID.PERCENTAGE_PER_DAY.value) {
      return {
        percentage: {
          type: "integer",
          label: "Percentage",
          description: "Percentage of working hours. Only values of `50` and `100` are allowed.",
          options: Object.values(constants.PERCENTAGE),
        },
      };
    }

    if (bookingMethodId === constants.BOOKING_METHOD_ID.TOTAL_TIME.value) {
      return {
        totalTime: {
          type: "integer",
          label: "Total Time",
          description: "Total time in minutes.",
        },
      };
    }

    return {};
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
      totalTime,
      bookingMethodId,
      note,
      percentage,
    } = this;

    const response = await createBooking({
      $,
      data: {
        data: {
          type: "bookings",
          attributes: {
            started_on: startedOn,
            ended_on: endedOn,
            note,
            booking_method_id: bookingMethodId,
            time,
            total_time: totalTime,
            percentage,
          },
          relationships: {
            person: {
              data: {
                type: "people",
                id: personId,
              },
            },
            origin: {
              data: {
                type: "bookings",
                id: "",
              },
            },
          },
        },
      },
    });

    $.export("$summary", `Successfully created a new booking with ID \`${response.data.id}\``);
    return response;
  },
};
