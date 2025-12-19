import launch27 from "../../launch27.app.mjs";

export default {
  key: "launch27-get-booking-spots",
  name: "Get Booking Spots",
  description: "Retrieves all booking spots for a given event type. [See the documentation](https://bitbucket.org/awoo23/api-2.0/wiki/Spots_for_booking)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    launch27,
    date: {
      type: "string",
      label: "Date",
      description: "The date to get booking spots for. Format: YYYY-MM-DD",
    },
    days: {
      type: "integer",
      label: "Days",
      description: "The number of days you need spots for starting from and including the date",
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Affects how available spots calculated: using reschedule booking policy or new booking policy. `new` mode should be used when you need to create new booking. Note: New booking policy is applied, so it is possible to have future spots not available because of the policy. `reschedule` mode should be used when you need to change date and/or time for already existing booking. Note: Booking reschedule policy is applied, so it is possible to have future spots not available because of the policy",
      options: [
        "new",
        "reschedule",
      ],
    },
    grid: {
      type: "boolean",
      label: "Grid",
      description: "If `true` response will contain grid and days sections",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.launch27.getBookingSpots({
      $,
      data: {
        date: this.date,
        days: this.days,
        mode: this.mode,
        grid: this.grid,
      },
    });
    $.export("$summary", "Successfully retrieved booking spots");
    return response;
  },
};
