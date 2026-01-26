import paystack from "../../paystack.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "paystack-create-customer",
  name: "Create Customer",
  description: "Create a customer on your integration. [See the documentation](https://paystack.com/docs/api/customer/#create)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: false,
  },
  props: {
    paystack,
    email: {
      type: "string",
      label: "Email",
      description: "Customer's email address",
    },
    firstName: {
      propDefinition: [
        paystack,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        paystack,
        "lastName",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        paystack,
        "phone",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        paystack,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.paystack.createCustomer({
      $,
      data: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        phone: this.phone,
        metadata: parseObject(this.metadata),
      },
    });

    $.export("$summary", `Successfully created customer with email ${this.email}`);
    return response;
  },
};
