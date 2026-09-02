import app from "../../sms_florin.app.mjs";

export default {
  key: "sms_florin-rent-number",
  name: "Rent a Number",
  description: "Rent a phone number for a service, debiting your account balance. [See the documentation](https://flo-voice1.com/api-access).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    serviceSlug: {
      propDefinition: [
        app,
        "serviceSlug",
      ],
    },
    period: {
      propDefinition: [
        app,
        "period",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.rentNumber({
      $,
      data: {
        serviceSlug: this.serviceSlug,
        period: this.period,
      },
    });
    $.export("$summary", `Successfully rented a number (rental ID ${response.rentalId})`);
    return response;
  },
};
