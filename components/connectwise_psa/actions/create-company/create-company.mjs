import connectwise from "../../connectwise_psa.app.mjs";

export default {
  key: "connectwise_psa-create-company",
  name: "Create Company",
  description: "Creates a new company in Connectwise. [See the documentation](https://developer.connectwise.com/Products/ConnectWise_PSA/REST#/Companies/postCompanyCompanies)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    connectwise,
    name: {
      type: "string",
      label: "Company Name",
      description: "The name of the new company",
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "A unique identifier for the company",
    },
    types: {
      propDefinition: [
        connectwise,
        "companyTypes",
      ],
    },
    status: {
      propDefinition: [
        connectwise,
        "status",
      ],
    },
    site: {
      type: "string",
      label: "Site Name",
      description: "The site name for the company",
    },
    address1: {
      type: "string",
      label: "Address Line 1",
      description: "First line of the company's address",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address Line 2",
      description: "Second line of the company's address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the company",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "State of the company",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "Zip code of the company",
      optional: true,
    },
    country: {
      propDefinition: [
        connectwise,
        "country",
      ],
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the company",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the company",
      optional: true,
    },
    market: {
      propDefinition: [
        connectwise,
        "market",
      ],
    },
    territory: {
      propDefinition: [
        connectwise,
        "territory",
      ],
    },
  },
  async run({ $ }) {
    const types = this.types.map((type) => ({
      id: type,
    }));
    const response = await this.connectwise.createCompany({
      $,
      data: {
        name: this.name,
        identifier: this.identifier,
        types,
        status: {
          id: this.status,
        },
        site: {
          name: this.site,
        },
        addressLine1: this.address1,
        addressLine2: this.address2,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country
          ? {
            id: this.country,
          }
          : undefined,
        phoneNumber: this.phone,
        website: this.website,
        market: this.market
          ? {
            id: this.market,
          }
          : undefined,
        territory: this.territory
          ? {
            id: this.territory,
          }
          : undefined,
      },
    });
    $.export("$summary", `Successfully created company with ID: ${response.id}`);
    return response;
  },
};
