import { ConfigurationError } from "@pipedream/platform";
import app from "../../mews.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Update Customer",
  description: "Update an existing customer in Mews. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/customers#update-customer)",
  key: "mews-update-customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      description: "Unique identifier of the Customer to be updated.",
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    lastName: {
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
    nationalityCode: {
      label: "Nationality Code",
      description: "New nationality code as ISO 3166-1 code of the Country.",
      propDefinition: [
        app,
        "countryCode",
      ],
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
      description: "Unique identifier of Company the customer is associated with.",
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
      customerId,
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
      italianDestinationCode,
      italianFiscalCode,
    } = this;

    const parsedClassifications = classifications
      ? utils.parseArray(classifications)
      : undefined;

    if (parsedClassifications && !Array.isArray(parsedClassifications)) {
      throw new ConfigurationError("**Classifications** must be an array when provided");
    }

    const parsedAddress = address
      ? utils.parseJson(address)
      : undefined;

    if (parsedAddress && typeof parsedAddress !== "object") {
      throw new ConfigurationError("**Address** must be a valid address object");
    }

    const response = await app.customersUpdate({
      $,
      data: {
        CustomerId: customerId,
        Title: title,
        FirstName: firstName,
        LastName: lastName,
        SecondLastName: secondLastName,
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
        ...(italianDestinationCode && {
          ItalianDestinationCode: {
            Value: italianDestinationCode,
          },
        }),
        ...(italianFiscalCode && {
          ItalianFiscalCode: {
            Value: italianFiscalCode,
          },
        }),
      },
    });

    $.export("$summary", `Successfully updated customer with ID \`${response.Id}\``);
    return response;
  },
};
