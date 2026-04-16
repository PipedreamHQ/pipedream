import qualiobee from "../../qualiobee.app.mjs";

export default {
  key: "qualiobee-update-customer",
  name: "Update Customer",
  description: "Update a customer in Qualiobee. [See the documentation](https://app.qualiobee.fr/api/doc/#/Customer/PublicCustomerController_updateOne)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    qualiobee,
    customerUuid: {
      propDefinition: [
        qualiobee,
        "customerUuid",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the company or the full name of the individual",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the referent in the company or the first name of the individual",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the referent in the company or the last name of the individual",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the customer",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note about the customer",
      optional: true,
    },
    isIndividual: {
      type: "boolean",
      label: "Is Individual",
      description: "Whether the customer is an individual",
      optional: true,
    },
    isSoloLearner: {
      type: "boolean",
      label: "Is Solo Learner",
      description: "Whether the customer is a solo learner",
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
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "The postal code of the address of the customer",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the address of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const hasLocation = this.addressLine1
      || this.addressLine2
      || this.city
      || this.postalCode
      || this.country;

    const response = await this.qualiobee.updateCustomer({
      $,
      customerUuid: this.customerUuid,
      data: {
        name: this.name,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
        note: this.note,
        isIndividual: this.isIndividual,
        isSoloLearner: this.isSoloLearner,
        location: hasLocation && {
          addressLine1: this.addressLine1,
          addressLine2: this.addressLine2,
          city: this.city,
          postalCode: this.postalCode,
          country: this.country,
        },
      },
    });
    $.export("$summary", `Successfully updated customer with UUID ${response.uuid}`);
    return response;
  },
};
