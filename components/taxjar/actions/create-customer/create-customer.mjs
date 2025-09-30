import app from "../../taxjar.app.mjs";

export default {
  key: "taxjar-create-customer",
  name: "Create Customer",
  description: "Creates a new customer at TaxJar. [See the documentation](https://developers.taxjar.com/api/reference/#post-create-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    exemptionType: {
      propDefinition: [
        app,
        "exemptionType",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        app,
        "state",
      ],
      optional: true,
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomer({
      $,
      data: {
        customer_id: this.customerId,
        exemption_type: this.exemptionType,
        name: this.name,
        country: this.country,
        state: this.state,
        zip: this.zip,
        city: this.city,
        street: this.street,
      },
    });
    $.export("$summary", `Successfully created customer with ID ${this.customerId}`);
    return response;
  },
};
