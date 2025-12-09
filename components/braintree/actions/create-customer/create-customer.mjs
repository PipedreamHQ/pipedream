import braintree from "../../braintree.app.mjs";
import mutations from "../../common/mutations.mjs";

export default {
  key: "braintree-create-customer",
  name: "Create Customer",
  description: "Create a new customer in Braintree. [See the documentation](https://developer.paypal.com/braintree/graphql/guides/customers/#create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    braintree,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the customer",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company name of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the customer",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Fax number of the customer",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.braintree.makeGraphQLRequest({
      $,
      data: {
        query: mutations.createCustomer,
        variables: {
          input: {
            customer: {
              firstName: this.firstName,
              lastName: this.lastName,
              company: this.company,
              email: this.email,
              phoneNumber: this.phoneNumber,
              fax: this.fax,
              website: this.website,
            },
          },
        },
      },
    });
    $.export("$summary", `Customer successfully created with id ${response.data.createCustomer.customer.id}`);
    return response;
  },
};
