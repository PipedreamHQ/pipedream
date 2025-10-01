import foursquare from "../../foursquare.app.mjs";

export default {
  key: "foursquare-create-check-in",
  name: "Create Check In",
  description: "Allows the user to generate a new check-in at a specific location on Foursquare. [See the documentation](https://docs.foursquare.com/developer/reference/create-a-checkin)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    foursquare,
    venueId: {
      propDefinition: [
        foursquare,
        "venueId",
      ],
    },
    shout: {
      type: "string",
      label: "Shout",
      description: "A message about your check-in.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.foursquare.createCheckIn({
      $,
      params: {
        venueId: this.venueId,
        shout: this.shout,
      },
    });

    $.export("$summary", `Successfully created check-in at venue ${this.venueId}`);
    return response;
  },
};
