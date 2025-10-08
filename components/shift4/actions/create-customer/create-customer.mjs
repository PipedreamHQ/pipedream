import { parseObject } from "../../common/utils.mjs";
import shift4 from "../../shift4.app.mjs";

export default {
  key: "shift4-create-customer",
  name: "Create Customer",
  description: "Creates a new customer object. [See the documentation](https://dev.shift4.com/docs/api#customers-create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shift4,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the customer.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description for the customer.",
      optional: true,
    },
    card: {
      propDefinition: [
        shift4,
        "card",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        shift4,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shift4.createCustomer({
      $,
      data: {
        email: this.email,
        description: this.description,
        card: this.card && parseObject(this.card),
        metadata: this.metadata && parseObject(this.metadata),
      },
    });

    $.export("$summary", `Successfully created customer with Id: ${response.id}`);
    return response;
  },
};
