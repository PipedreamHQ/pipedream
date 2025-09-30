import { parseObject } from "../../common/utils.mjs";
import omiseApp from "../../omise.app.mjs";

export default {
  key: "omise-create-customer",
  name: "Create Customer",
  description: "Registers a new customer in the OPN platform. [See the documentation](https://docs.opn.ooo/customers-api#create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    omiseApp,
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
      metadata,
      ...data
    } = this;

    const response = await omiseApp.createCustomer({
      $,
      data: {
        ...data,
        metadata: parseObject(metadata),
      },
    });

    $.export("$summary", `Successfully created customer with Id: ${response.id}`);
    return response;
  },
};
