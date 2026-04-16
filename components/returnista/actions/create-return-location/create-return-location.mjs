import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-create-return-location",
  name: "Create Return Location",
  description: "Creates a new return location for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/return-location)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    returnista,
    accountId: {
      propDefinition: [
        returnista,
        "accountId",
      ],
    },
    name: {
      propDefinition: [
        returnista,
        "name",
      ],
    },
    street: {
      propDefinition: [
        returnista,
        "street",
      ],
    },
    houseNumber: {
      propDefinition: [
        returnista,
        "houseNumber",
      ],
    },
    suffix: {
      propDefinition: [
        returnista,
        "suffix",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        returnista,
        "city",
      ],
    },
    postalCode: {
      propDefinition: [
        returnista,
        "postalCode",
      ],
    },
    countryCode: {
      propDefinition: [
        returnista,
        "countryCode",
      ],
    },
    stateProvinceCode: {
      propDefinition: [
        returnista,
        "stateProvinceCode",
      ],
      optional: true,
    },
    companyName: {
      propDefinition: [
        returnista,
        "companyName",
      ],
    },
    attention: {
      propDefinition: [
        returnista,
        "attention",
      ],
      optional: true,
    },
    phoneNumber: {
      propDefinition: [
        returnista,
        "phoneNumber",
      ],
    },
    contactName: {
      propDefinition: [
        returnista,
        "contactName",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.returnista.createReturnLocation({
      $,
      accountId: this.accountId,
      data: {
        name: this.name,
        returnAddress: {
          street: this.street,
          houseNumber: this.houseNumber,
          suffix: this.suffix,
          city: this.city,
          postalCode: this.postalCode,
          countryCode: this.countryCode,
          stateProvinceCode: this.stateProvinceCode,
        },
        companyName: this.companyName,
        attention: this.attention,
        phoneNumber: this.phoneNumber,
        contactName: this.contactName,
      },
    });
    $.export("$summary", `Successfully created return location with ID: ${response.id}`);
    return response;
  },
};
