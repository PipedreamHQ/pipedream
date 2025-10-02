import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-create-company",
  name: "Create Company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new company [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    name: {
      propDefinition: [
        roll,
        "name",
      ],
      optional: true,
    },
    invoiceFirstName: {
      type: "string",
      label: "Invoice First Name",
      description: "The first name will be used on invoices.",
      optional: true,
    },
    invoiceLastName: {
      type: "string",
      label: "Invoice Last Name",
      description: "The last name will be used on invoices.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The company's phone number.",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The company's mobile phone number.",
      optional: true,
    },
    email: {
      propDefinition: [
        roll,
        "email",
      ],
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The company's website.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The company's address.",
      optional: true,
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "The company's additional address.",
      optional: true,
    },
    cityOrTown: {
      type: "string",
      label: "City Or Town",
      description: "The company's city.",
      optional: true,
    },
    stateOrRegion: {
      type: "string",
      label: "State Or Region",
      description: "The company's state.",
      optional: true,
    },
    zipOrPostcode: {
      type: "string",
      label: "Zip Or Postcode",
      description: "The company's zip.",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The company's country.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      roll,
      ...variables
    } = this;

    const response = await this.roll.makeRequest({
      variables: _.pickBy(variables),
      query: "addCompany",
      type: "mutation",
    });

    $.export("$summary", `Company successfully created with Id ${response.addCompany.CompanyId}!`);
    return response;
  },
};
