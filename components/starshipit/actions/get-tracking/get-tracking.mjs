import starshipit from "../../starshipit.app.mjs"

export default {
  key: "starshipit-get-tracking",
  name: "Get Tracking Details",
  description: "Retrieve tracking details using a tracking number or order number. [See the documentation](https://api-docs.starshipit.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    starshipit,
    trackingNumber: {
      propDefinition: [
        starshipit,
        "trackingNumber"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.starshipit.getTrackingDetails(this.trackingNumber);
    $.export("$summary", `Successfully retrieved tracking details for ${this.trackingNumber}`);
    return response;
  },
};