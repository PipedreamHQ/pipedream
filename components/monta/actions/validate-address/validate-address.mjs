import monta from "../../monta.app.mjs";

export default {
  key: "monta-validate-address",
  name: "Validate Address",
  description: "Validate a delivery address before submitting it, for example ahead of **Create Order** or **Update Order**. Monta returns structured error codes when the address is invalid; a complete address also needs a recipient (Company or Last Name), Postal Code, and House Number. [See the documentation](https://api-v6.monta.nl/index.html#tag/Address/paths/~1address/post)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    street: {
      propDefinition: [
        monta,
        "street",
      ],
    },
    city: {
      propDefinition: [
        monta,
        "city",
      ],
    },
    countryCode: {
      propDefinition: [
        monta,
        "countryCode",
      ],
    },
    houseNumber: {
      propDefinition: [
        monta,
        "houseNumber",
      ],
      optional: true,
    },
    houseNumberAddition: {
      propDefinition: [
        monta,
        "houseNumberAddition",
      ],
      optional: true,
    },
    postalCode: {
      propDefinition: [
        monta,
        "postalCode",
      ],
      optional: true,
    },
    state: {
      propDefinition: [
        monta,
        "state",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        monta,
        "company",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        monta,
        "firstName",
      ],
      optional: true,
    },
    middleName: {
      propDefinition: [
        monta,
        "middleName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        monta,
        "lastName",
      ],
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        monta,
        "phoneNumber",
      ],
      optional: true,
    },
    emailAddress: {
      propDefinition: [
        monta,
        "emailAddress",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    await this.monta.validateAddress({
      $,
      data: {
        Street: this.street,
        City: this.city,
        CountryCode: this.countryCode,
        HouseNumber: this.houseNumber,
        HouseNumberAddition: this.houseNumberAddition,
        PostalCode: this.postalCode,
        State: this.state,
        Company: this.company,
        FirstName: this.firstName,
        MiddleName: this.middleName,
        LastName: this.lastName,
        PhoneNumber: this.phoneNumber,
        EmailAddress: this.emailAddress,
      },
    });

    $.export("$summary", "Address is valid");

    return {
      valid: true,
    };
  },
};
