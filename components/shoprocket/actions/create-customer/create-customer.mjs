import shoprocket from "../../shoprocket.app.mjs";

export default {
  key: "shoprocket-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Shoprocket. [See the documentation](https://docs.shoprocket.io/#72180ccd-3b7d-4597-9f1e-f669397555e7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    shoprocket,
    email: {
      type: "string",
      label: "Customer Email",
      description: "Customer's email address.",
    },
    name: {
      type: "string",
      label: "Customer Name",
      description: "The customer's full name.",
      optional: true,
    },
    contact: {
      type: "string",
      label: "Customer Contact",
      description: "The customer's phone number.",
      optional: true,
    },
    marketing: {
      type: "boolean",
      label: "Marketing",
      description: "Whether customer has opted-in for newsletter",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.shoprocket.createCustomer({
      $,
      data: {
        customer_email: this.email,
        customer_name: this.name,
        customer_contact: this.contact,
        marketing_subscribed: +this.marketing,
      },
    });

    $.export("$summary", `Successfully created customer with ID: ${response.data?.id}`);
    return response;
  },
};
