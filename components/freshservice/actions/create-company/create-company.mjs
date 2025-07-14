import freshservice from "../../freshservice.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshservice-create-company",
  name: "Create Company",
  description: "Create a new company in Freshservice. [See the documentation](https://api.freshservice.com/v2/#create_company)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the company",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the company",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note about the company",
      optional: true,
    },
    domains: {
      type: "string[]",
      label: "Domains",
      description: "Domains associated with the company",
      optional: true,
    },
    primary_email: {
      type: "string",
      label: "Primary Email",
      description: "Primary email of the company",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the company",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the company",
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
    zip_code: {
      type: "string",
      label: "Zip Code",
      description: "Zip code of the company",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "Country of the company",
      optional: true,
    },
    custom_fields: {
      type: "object",
      label: "Custom Fields",
      description: "Custom fields as a JSON object",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      custom_fields,
      domains,
      ...otherProps
    } = this;

    const data = removeNullEntries(otherProps);
    
    if (custom_fields) {
      data.custom_fields = this.freshservice.parseIfJSONString(custom_fields);
    }

    if (domains && domains.length > 0) {
      data.domains = domains;
    }

    const response = await this.freshservice.createCompany({
      data,
      $,
    });

    $.export("$summary", `Successfully created company: ${response.company?.name}`);
    return response;
  },
};