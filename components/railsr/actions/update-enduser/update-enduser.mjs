import app from "../../railsr.app.mjs";

export default {
  key: "railsr-update-enduser",
  name: "Update Enduser",
  description: "Update an enduser with the specified ID. [See the documentation](https://docs.railsr.com/docs/api/89ce9c581fe4c-update-enduser)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
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
    const response = await this.app.updateEnduser({
      $,
      id: this.id,
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

    $.export("$summary", `Successfully updated Enduser with ID: '${response.enduserId}'`);

    return response;
  },
};
