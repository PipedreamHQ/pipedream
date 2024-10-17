import app from "../../railsr.app.mjs";

export default {
  key: "railsr-create-enduser",
  name: "Create Enduser",
  description: "Creates a new enduser. [See the documentation](https://docs.railsr.com/docs/api/ecddbb2cf921a-create-enduser)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    accountUsage: {
      propDefinition: [
        app,
        "accountUsage",
      ],
    },
    citizenships: {
      propDefinition: [
        app,
        "citizenships",
      ],
    },
    riskScore: {
      propDefinition: [
        app,
        "riskScore",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    dateOfBirth: {
      propDefinition: [
        app,
        "dateOfBirth",
      ],
    },
    gender: {
      propDefinition: [
        app,
        "gender",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    telephone: {
      propDefinition: [
        app,
        "telephone",
      ],
    },
    isPep: {
      propDefinition: [
        app,
        "isPep",
      ],
    },
    accountRange: {
      propDefinition: [
        app,
        "accountRange",
      ],
    },
    accountCurrency: {
      propDefinition: [
        app,
        "accountCurrency",
      ],
    },
    houseNumber: {
      propDefinition: [
        app,
        "houseNumber",
      ],
    },
    street: {
      propDefinition: [
        app,
        "street",
      ],
    },
    city: {
      propDefinition: [
        app,
        "city",
      ],
    },
    postalCode: {
      propDefinition: [
        app,
        "postalCode",
      ],
    },
    residentialCountry: {
      propDefinition: [
        app,
        "residentialCountry",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createEnduser({
      $,
      data: {
        taxResidences: [
          {
            country: this.country,
          },
        ],
        accountUsage: {
          types: this.accountUsage,
        },
        citizenships: this.citizenships,
        riskScore: this.riskScore,
        lastName: this.lastName,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        email: this.email,
        firstName: this.firstName,
        telephone: this.telephone,
        type: "person",
        isPep: this.isPep,
        expectedVolume: {
          range: this.accountRange,
          type: "monthly",
          currency: this.accountCurrency,
        },
        residentialAddress: {
          houseNumber: this.houseNumber,
          street: this.street,
          city: this.city,
          postalCode: this.postalCode,
          country: this.residentialCountry,
        },
      },
    });

    $.export("$summary", `Successfully created Enduser with ID: '${response.enduserId}'`);

    return response;
  },
};
