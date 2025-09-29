import { ConfigurationError } from "@pipedream/platform";
import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Add Customer",
  description: "Adds a new customer to the system. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#add-customer)",
  key: "mews-add-customer",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    overwriteExisting: {
      type: "boolean",
      label: "Overwrite Existing",
      description: "Whether an existing customer should be overwritten in case of duplicity. This applies only to basic personal information",
    },
    lastName: {
      optional: false,
      propDefinition: [
        app,
        "lastName",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    secondLastName: {
      propDefinition: [
        app,
        "secondLastName",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    nationalityCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
      label: "Nationality Code",
      description: "ISO 3166-1 code of the Country",
    },
    sex: {
      propDefinition: [
        app,
        "sex",
      ],
    },
    birthDate: {
      propDefinition: [
        app,
        "birthDate",
      ],
    },
    birthPlace: {
      propDefinition: [
        app,
        "birthPlace",
      ],
    },
    occupation: {
      propDefinition: [
        app,
        "occupation",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    loyaltyCode: {
      propDefinition: [
        app,
        "loyaltyCode",
      ],
    },
    notes: {
      description: "Internal notes about the customer",
      propDefinition: [
        app,
        "notes",
      ],
      optional: true,
    },
    carRegistrationNumber: {
      propDefinition: [
        app,
        "carRegistrationNumber",
      ],
    },
    dietaryRequirements: {
      propDefinition: [
        app,
        "dietaryRequirements",
      ],
    },
    taxIdentificationNumber: {
      propDefinition: [
        app,
        "taxIdentificationNumber",
      ],
    },
    companyId: {
      propDefinition: [
        app,
        "companyId",
      ],
      optional: true,
    },
    address: {
      propDefinition: [
        app,
        "address",
      ],
    },
    classifications: {
      propDefinition: [
        app,
        "classifications",
      ],
    },
    options: {
      propDefinition: [
        app,
        "options",
      ],
    },
    italianDestinationCode: {
      propDefinition: [
        app,
        "italianDestinationCode",
      ],
    },
    italianFiscalCode: {
      propDefinition: [
        app,
        "italianFiscalCode",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      title,
      firstName,
      lastName,
      secondLastName,
      nationalityCode,
      sex,
      birthDate,
      birthPlace,
      occupation,
      email,
      phone,
      loyaltyCode,
      notes,
      carRegistrationNumber,
      dietaryRequirements,
      taxIdentificationNumber,
      companyId,
      address,
      classifications,
      options,
      overwriteExisting,
      italianDestinationCode,
      italianFiscalCode,
    } = this;

    const parsedClassifications = classifications
      ? utils.parseArray(classifications)
      : undefined;

    // Validate array
    if (parsedClassifications && !Array.isArray(parsedClassifications)) {
      throw new ConfigurationError("**Classifications** must be an array when provided");
    }

    const parsedAddress = address
      ? utils.parseJson(address)
      : undefined;

    // Validate address
    if (parsedAddress && typeof parsedAddress !== "object") {
      throw new ConfigurationError("**Address** must be a valid address object");
    }

    const response = await app.customersAdd({
      $,
      data: {
        LastName: lastName,
        FirstName: firstName,
        SecondLastName: secondLastName,
        Title: title,
        NationalityCode: nationalityCode,
        Sex: sex,
        BirthDate: birthDate,
        BirthPlace: birthPlace,
        Occupation: occupation,
        Email: email,
        Phone: phone,
        LoyaltyCode: loyaltyCode,
        Notes: notes,
        CarRegistrationNumber: carRegistrationNumber,
        DietaryRequirements: dietaryRequirements,
        TaxIdentificationNumber: taxIdentificationNumber,
        CompanyId: companyId,
        Address: parsedAddress,
        Classifications: parsedClassifications,
        Options: options,
        OverwriteExisting: overwriteExisting,
        ItalianDestinationCode: italianDestinationCode,
        ItalianFiscalCode: italianFiscalCode,
      },
    });

    $.export("$summary", `Successfully added customer${response.Email
      ? ` with email ${response.Email}`
      : ""}`);
    return response;
  },
};
