import { ConfigurationError } from "@pipedream/platform";
import returnista from "../../returnista.app.mjs";

export default {
  key: "returnista-update-return-location",
  name: "Update Return Location",
  description: "Updates a return location for the given account. [See the documentation](https://platform.returnista.com/reference/rest-api/#patch-/account/-accountId/return-location/-returnLocationId)",
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
    returnLocationId: {
      propDefinition: [
        returnista,
        "returnLocationId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
    name: {
      propDefinition: [
        returnista,
        "name",
      ],
      optional: true,
    },
    street: {
      propDefinition: [
        returnista,
        "street",
      ],
      optional: true,
    },
    houseNumber: {
      propDefinition: [
        returnista,
        "houseNumber",
      ],
      optional: true,
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
      optional: true,
    },
    postalCode: {
      propDefinition: [
        returnista,
        "postalCode",
      ],
      optional: true,
    },
    countryCode: {
      propDefinition: [
        returnista,
        "countryCode",
      ],
      optional: true,
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
      optional: true,
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
      optional: true,
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
    const data = {};
    if (this.name) data.name = this.name;
    if (this.companyName) data.companyName = this.companyName;
    if (this.attention) data.attention = this.attention;
    if (this.phoneNumber) data.phoneNumber = this.phoneNumber;
    if (this.contactName) data.contactName = this.contactName;

    const returnAddress = {};
    if (this.street) returnAddress.street = this.street;
    if (this.houseNumber) returnAddress.houseNumber = this.houseNumber;
    if (this.suffix) returnAddress.suffix = this.suffix;
    if (this.city) returnAddress.city = this.city;
    if (this.postalCode) returnAddress.postalCode = this.postalCode;
    if (this.countryCode) returnAddress.countryCode = this.countryCode;
    if (this.stateProvinceCode) returnAddress.stateProvinceCode = this.stateProvinceCode;

    if (!Object.keys(data).length && !Object.keys(returnAddress).length) {
      throw new ConfigurationError("At least one field must be provided");
    }
    if (Object.keys(returnAddress).length > 0) data.returnAddress = returnAddress;

    const response = await this.returnista.updateReturnLocation({
      $,
      accountId: this.accountId,
      returnLocationId: this.returnLocationId,
      data,
    });
    $.export("$summary", `Successfully updated return location with ID: ${this.returnLocationId}`);
    return response;
  },
};
