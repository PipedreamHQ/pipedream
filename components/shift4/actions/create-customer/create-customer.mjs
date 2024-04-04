import shift4 from "../../shift4.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "shift4-create-customer",
  name: "Create Customer",
  description: "Creates a new customer object. [See the documentation](https://dev.shift4.com/docs/api#customers-create-a-customer)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    shift4,
    email: {
      propDefinition: [
        shift4,
        "email",
      ],
    },
    description: {
      propDefinition: [
        shift4,
        "description",
        (c) => ({
          optional: true,
        }),
      ],
    },
    card: {
      propDefinition: [
        shift4,
        "card",
        (c) => ({
          optional: true,
        }),
      ],
    },
    metadata: {
      propDefinition: [
        shift4,
        "metadata",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.shift4.createCustomer({
      email: this.email,
      description: this.description,
      card: this.card,
      metadata: this.metadata,
    });

    $.export("$summary", `Successfully created customer with email ${this.email}`);
    return response;
  },
};
