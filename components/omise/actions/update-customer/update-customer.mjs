import { parseObject } from "../../common/utils.mjs";
import omiseApp from "../../omise.app.mjs";

export default {
  key: "omise-update-customer",
  name: "Update Customer",
  description: "Update a customer's information and payment details in the OPN system. [See the documentation](https://docs.opn.ooo/customers-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      optional: true,
    },
    description: {
      propDefinition: [
        omiseApp,
        "description",
      ],
      optional: true,
    },
    card: {
      propDefinition: [
        omiseApp,
        "card",
      ],
      optional: true,
    },
    defaultCard: {
      propDefinition: [
        omiseApp,
        "defaultCard",
      ],
      optional: true,
    },
    metadata: {
      propDefinition: [
        omiseApp,
        "metadata",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      omiseApp,
      customerId,
      metadata,
      ...data
    } = this;

    const response = await omiseApp.updateCustomer({
      $,
      customerId,
      data: {
        ...data,
        metadata: parseObject(metadata),
      },
    });

    $.export("$summary", `Successfully updated customer with ID ${customerId}`);
    return response;
  },
};
