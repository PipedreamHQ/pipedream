import resourceGuru from "../../resource_guru.app.mjs";

export default {
  key: "resource_guru-delete-booking",
  name: "Delete Booking",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a specific booking identified by Id. [See the documentation](https://resourceguruapp.com/docs/api#tag/booking/paths/~1v1~1%7Baccount%7D~1bookings~1%7Bid%7D/delete)",
  type: "action",
  props: {
    resourceGuru,
    bookingId: {
      propDefinition: [
        resourceGuru,
        "bookingId",
      ],
    },
    affects: {
      type: "string",
      label: "Affects",
      description: "Specify how the operation affects other occurrences of a repeat booking.",
      options: [
        "all",
        "following",
        "single",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date to delete in `YYYY-MM-DD` format, for example `2023-12-20`.",
      optional: true,
    },
    removeForAll: {
      type: "boolean",
      label: "Remove For All",
      description: "Delete the date for all resources on the booking.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      resourceGuru,
      bookingId,
      affects,
      removeForAll,
      ...data
    } = this;

    const response = await resourceGuru.deleteBooking({
      $,
      bookingId,
      params: {
        affects,
      },
      data: {
        ...data,
        remove_for_all: removeForAll,
      },
    });

    $.export("$summary", `The booking with Id: ${bookingId} was successfully deleted!`);
    return response;
  },
};
