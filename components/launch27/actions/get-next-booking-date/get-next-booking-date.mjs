import launch27 from "../../launch27.app.mjs";

export default {
  key: "launch27-get-next-booking-date",
  name: "Get Next Booking Date",
  description: "Retrieves the next booking date for a given frequency. [See the documentation](https://bitbucket.org/awoo23/api-2.0/wiki/Next_booking_date_for_frequency)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    launch27,
    frequencyId: {
      propDefinition: [
        launch27,
        "frequencyId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date for which next recurring date should be calculated. Format: YYYY-MM-DDTHH:MM:SS",
    },
  },
  async run({ $ }) {
    const response = await this.launch27.getNextBookingDate({
      $,
      frequencyId: this.frequencyId,
      data: {
        date: this.date,
      },
    });
    $.export("$summary", "Successfully retrieved next booking date");
    return response;
  },
};
