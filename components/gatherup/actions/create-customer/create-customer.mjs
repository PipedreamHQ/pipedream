import gatherup from "../../gatherup.app.mjs";

export default {
  name: "Create Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "gatherup-create-customer",
  description: "Creates a customer. [See docs here](https://apidocs.gatherup.com/#fa6d95bf-df57-4e3c-a1f1-2e0438a2e9a6)",
  type: "action",
  props: {
    gatherup,
    businessId: {
      propDefinition: [
        gatherup,
        "businessId",
      ],
    },
    firstName: {
      label: "First Name",
      description: "First name of the customer",
      type: "string",
    },
    lastName: {
      label: "Last Name",
      description: "Last name of the customer",
      type: "string",
    },
    email: {
      label: "Email",
      description: "Email of the customer",
      type: "string",
    },
    phone: {
      label: "Phone",
      description: "Phone number of the customer. E.g. `+5547991048908`",
      type: "string",
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "Tags of the customer. E.g. `brakes,tires`",
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gatherup.createCustomer({
      $,
      data: {
        businessId: this.businessId,
        customerFirstName: this.firstName,
        customerLastName: this.lastName,
        customerEmail: this.email,
        customerPhone: this.phone,
        customerTags: this.tags,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created customer with ID ${response.customerId}`);
    }

    return response;
  },
};
