import app from "../../sms_florin.app.mjs";

export default {
  key: "sms_florin-get-rental",
  name: "Get Rental",
  description: "Fetch a point-in-time snapshot of a rental — its status, the assigned phone number and country, and every SMS received so far. The `Rental ID` comes from **Rent a Number**. Poll this (or use the **New SMS Received** source) until the code you need appears. [See the documentation](https://flo-voice1.com/api-access).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    rentalId: {
      propDefinition: [
        app,
        "rentalId",
      ],
    },
  },
  async run({ $ }) {
    const rental = await this.app.getRental({
      $,
      rentalId: this.rentalId,
    });
    $.export("$summary", `Retrieved rental ${this.rentalId} (status: ${rental.status})`);
    return rental;
  },
};
