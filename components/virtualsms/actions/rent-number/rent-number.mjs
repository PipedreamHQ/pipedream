import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-rent-number",
  name: "Rent Number",
  description: "Rent a real-SIM virtual phone number to receive an SMS verification code. Returns the order ID and assigned phone number — pair this with the **New SMS Received** trigger or the **Check Messages** action to retrieve the code. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    virtualsms,
    service: {
      propDefinition: [
        virtualsms,
        "service",
      ],
    },
    country: {
      propDefinition: [
        virtualsms,
        "country",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.virtualsms.rentNumber({
      $,
      service: this.service,
      country: this.country,
    });

    const phone = response?.phone_number ?? "(pending)";
    const orderId = response?.order_id ?? response?.id ?? "(unknown)";
    $.export("$summary", `Rented ${phone} for ${this.service} (order ${orderId})`);
    return response;
  },
};
