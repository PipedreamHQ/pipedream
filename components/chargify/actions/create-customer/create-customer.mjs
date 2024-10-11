import chargify from "../../chargify.app.mjs";

export default {
  key: "chargify-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Chargify",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chargify,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    organization: {
      type: "string",
      label: "Organization",
      description: "The organization of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.chargify.createCustomer({
      data: {
        customer: {
          first_name: this.name,
          email: this.email,
          organization: this.organization,
        },
      },
    });
    $.export("$summary", `Successfully created customer ${this.name}`);
    return response;
  },
};