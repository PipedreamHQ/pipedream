import billsby from "../../billsby.app.mjs";

export default {
  key: "billsby-update-customer-details",
  name: "Update Customer Details",
  description: "Update the details of a customer. [See the documentation](https://support.billsby.com/reference/put-customer)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    billsby,
    customerId: {
      propDefinition: [
        billsby,
        "customerId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Address Line 1",
      description: "The first line of the address of the customer",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Address Line 2",
      description: "The second line of the address of the customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the address of the customer",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the address of the customer",
      optional: true,
    },
    postCode: {
      type: "string",
      label: "Post Code",
      description: "The postal code of the address of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the address of the customer",
      optional: true,
    },
    phoneNumberDialCountry: {
      type: "string",
      label: "Phone Number Dial Country",
      description: "The customers phone number dial country (i.e. \"UK\")",
      optional: true,
    },
    phoneNumberDialCode: {
      type: "string",
      label: "Phone Number Dial Code",
      description: "The customer phone number dial code",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The customer phone number",
      optional: true,
    },
  },
  async run({ $ }) {
    const customer = await this.billsby.getCustomer({
      $,
      customerId: this.customerId,
    });

    const response = await this.billsby.updateCustomer({
      $,
      customerId: this.customerId,
      data: {
        firstName: this.firstName || customer.firstName,
        lastName: this.lastName || customer.lastName,
        email: this.email || customer.email,
        phoneNumberDialCountry: this.phoneNumberDialCountry || customer.phoneNumberDialCountry,
        phoneNumberDialCode: this.phoneNumberDialCode || customer.phoneNumberDialCode,
        phoneNumber: this.phoneNumber || customer.phoneNumber,
        billingAddress: {
          addressLine1: this.addressLine1 || customer.billingAddress.addressLine1,
          addressLine2: this.addressLine2 || customer.billingAddress.addressLine2,
          city: this.city || customer.billingAddress.city,
          state: this.state || customer.billingAddress.state,
          postCode: this.postCode || customer.billingAddress.postCode,
          country: this.country || customer.billingAddress.country,
        },
      },
    });

    $.export("$summary", "Successfully updated customer details");
    return response;
  },
};
