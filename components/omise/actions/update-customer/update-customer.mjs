import omiseApp from "../../omise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omise-update-customer",
  name: "Update Customer",
  description: "Update a customer's information and payment details in the OPN system. [See the documentation](https://docs.opn.ooo/customers-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    omiseApp,
    customerId: {
      propDefinition: [
        omiseApp,
        "customerId",
      ],
    },
    email: {
      propDefinition: [
        omiseApp,
        "email",
      ],
    },
    description: {
      propDefinition: [
        omiseApp,
        "description",
        (c) => ({
          optional: true,
        }),
      ],
    },
    cardToken: {
      propDefinition: [
        omiseApp,
        "cardToken",
        (c) => ({
          optional: true,
        }),
      ],
    },
    defaultCard: {
      propDefinition: [
        omiseApp,
        "defaultCard",
        (c) => ({
          optional: true,
        }),
      ],
    },
    metadata: {
      propDefinition: [
        omiseApp,
        "metadata",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.omiseApp.updateCustomer({
      customerId: this.customerId,
      email: this.email,
      description: this.description,
      cardToken: this.cardToken,
      defaultCard: this.defaultCard,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully updated customer with ID ${this.customerId}`);
    return response;
  },
};
