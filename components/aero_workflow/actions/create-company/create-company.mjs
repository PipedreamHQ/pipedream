import app from "../../aero_workflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "aero_workflow-create-company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create Company",
  description: "Creates a company [See the docs here](https://api.aeroworkflow.com/swagger/index.html)",
  props: {
    app,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Company name",
    },
    defaultEmailAddress: {
      type: "string",
      label: "Default Email Address",
      description: "Default email address",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "Website",
      optional: true,
    },
    accountNumber: {
      type: "string",
      label: "Account Number",
      description: "Account number",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "Fax",
      optional: true,
    },
    hourlyBillableRate: {
      type: "integer",
      label: "Hourly Billable Rate",
      description: "Hourly billable rate",
      optional: true,
    },
    monthlyFixedFee: {
      type: "integer",
      label: "Monthly Fixed Fee",
      description: "Monthly fixed fee",
      optional: true,
    },
    contactFirstName: {
      type: "string",
      label: "Contact First Name",
      description: "Contact first name",
      optional: true,
    },
    contactLastName: {
      type: "string",
      label: "Contact Last Name",
      description: "Contact last name",
      optional: true,
    },
    addressLine1: {
      type: "string",
      label: "Company Address Line 1",
      description: "Address line 1",
      optional: true,
    },
    addressLine2: {
      type: "string",
      label: "Company Line 2",
      description: "Address line 2",
      optional: true,
    },
    addressLine3: {
      type: "string",
      label: "Company Line 3",
      description: "Address line 3",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "City (Address)",
      description: "Address city",
      optional: true,
    },
    addressState: {
      type: "string",
      label: "State (Address)",
      description: "Address state",
      optional: true,
    },
    addressPostalCode: {
      type: "string",
      label: "Postal Code (Address)",
      description: "Address postal code",
      optional: true,
    },
    addressCountry: {
      type: "string",
      label: "Country (Address)",
      description: "Address country",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Company notes",
      optional: true,
    },
    isLead: {
      type: "boolean",
      label: "Is Lead",
      description: "Set true if it is a lead",
      optional: true,
    },
  },
  async run ({ $ }) {
    const pairs = {
      companyName: "name",
    };
    const data = utils.extractProps(this, pairs);
    const resp = await this.app.createCompany({
      $,
      data,
    });
    $.export("$summary", `The company(ID: ${resp.id}) has been created successfully.`);
    return resp;
  },
};
