import omiseApp from "../../omise.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "omise-create-customer",
  name: "Create Customer",
  description: "Registers a new customer with their payment details in the OPN platform. [See the documentation](https://docs.opn.ooo/customers-api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    omiseApp,
    email: {
      propDefinition: [
        omiseApp,
        "email",
        {
          optional: true,
        },
      ],
    },
    description: {
      propDefinition: [
        omiseApp,
        "description",
        {
          optional: true,
        },
      ],
    },
    cardToken: {
      propDefinition: [
        omiseApp,
        "cardToken",
        {
          optional: true,
        },
      ],
    },
    metadata: {
      propDefinition: [
        omiseApp,
        "metadata",
        {
          optional: true,
        },
      ],
    },
    defaultCard: {
      propDefinition: [
        omiseApp,
        "defaultCard",
        {
          optional: true,
        },
      ],
    },
    capture: {
      propDefinition: [
        omiseApp,
        "capture",
        {
          optional: true,
          default: true,
        },
      ],
    },
    returnUri: {
      propDefinition: [
        omiseApp,
        "returnUri",
        {
          optional: true,
        },
      ],
    },
    sourceId: {
      propDefinition: [
        omiseApp,
        "sourceId",
        {
          optional: true,
        },
      ],
    },
  },
  async run({ $ }) {
    const response = await this.omiseApp.createCustomer({
      email: this.email,
      description: this.description,
      cardToken: this.cardToken,
      metadata: this.metadata,
      defaultCard: this.defaultCard,
      capture: this.capture,
      returnUri: this.returnUri,
      sourceId: this.sourceId,
    });

    $.export("$summary", `Successfully created customer with email: ${this.email}`);
    return response;
  },
};
