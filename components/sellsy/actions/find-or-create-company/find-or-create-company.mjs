import sellsy from "../../sellsy.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "sellsy-find-or-create-company",
  name: "Find Or Create Company",
  description: "Checks to see if a company exists in Sellsy and creates it if it doesn't. [See the documentation](https://api.sellsy.com/doc/v2/#operation/create-company)",
  version: "0.0.1",
  type: "action",
  props: {
    sellsy,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company. If the company does not exist, it will be created",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the company",
      options: constants.COMPANY_TYPES,
    },
    email: {
      type: "string",
      label: "Company Email",
      description: "Email of the company",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website of the company",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the company",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note about the company",
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.sellsy.searchCompanies({
      $,
      data: {
        filters: {
          name: this.name,
        },
      },
    });
    let operation, response;
    if (data?.length) {
      operation = "found";
      response = data;
    } else {
      operation = "created";
      response = await this.sellsy.createCompany({
        $,
        data: {
          name: this.name,
          type: this.type,
          email: this.email,
          website: this.website,
          phone_number: this.phone,
          note: this.note,
        },
      });
    }
    $.export("$summary", `Successfully ${operation} company ${this.name}`);
    return response;
  },
};
