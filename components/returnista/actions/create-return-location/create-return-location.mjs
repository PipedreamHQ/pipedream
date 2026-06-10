import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-create-return-location",
  name: "Create Return Location",
  description: "Creates a new return location (warehouse or depot address) for an account."
    + " Required: `accountId`, `name`, `companyName`, `phoneNumber`, `street`, `houseNumber`, `city`, `postalCode`,"
    + " `countryCode` (ISO 3166-1 alpha-2, e.g. `NL`, `DE`, `GB`, `US`)."
    + " Optional: `suffix`, `stateProvinceCode`, `attention`, `contactName`."
    + " To update a location after creation, use **Update Return Location** with the returned ID."
    + " [See the documentation](https://platform.returnista.com/reference/rest-api/#post-/account/-accountId/return-location)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    companyName: {
      propDefinition: [
        returnista,
        "companyName",
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
    },
    attention: {
      propDefinition: [
        returnista,
        "attention",
      ],
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
    $.export("$summary", `Successfully created return location "${this.name}" with ID: ${response.id}`);
    return response;
  },
};
