import app from "../../sms_florin.app.mjs";

export default {
  key: "sms_florin-get-rental",
  name: "Get Rental",
  description: "Retrieve a rental's status, phone number, and any SMS received so far. [See the documentation](https://flo-voice1.com/api-access).",
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
