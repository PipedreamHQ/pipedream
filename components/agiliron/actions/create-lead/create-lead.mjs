import agiliron from "../../agiliron.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiliron-create-lead",
  name: "Create Lead",
  description: "Establishes a new lead within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-lead-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiliron,
    lastname: {
      propDefinition: [
        agiliron,
        "lastname",
      ],
    },
    company: {
      propDefinition: [
        agiliron,
        "company",
      ],
    },
    salutation: {
      type: "string",
      label: "Salutation",
      description: "The salutation of the contact or lead",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact or lead",
      optional: true,
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "The designation of the contact or lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the contact or lead",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "The mobile number of the contact or lead",
      optional: true,
    },
    fax: {
      type: "string",
      label: "Fax",
      description: "The fax number of the contact or lead",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact or lead",
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the contact or lead",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry of the contact or lead",
      optional: true,
    },
    sicCode: {
      type: "string",
      label: "SIC Code",
      description: "The SIC code of the contact or lead",
      optional: true,
    },
    annualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "The annual revenue of the contact or lead",
      optional: true,
    },
    numberOfEmployees: {
      type: "string",
      label: "Number of Employees",
      description: "The number of employees of the contact or lead",
      optional: true,
    },
    contactType: {
      type: "string",
      label: "Contact Type",
      description: "The contact type of the contact or lead",
      optional: true,
    },
    leadSource: {
      type: "string",
      label: "Lead Source",
      description: "The lead source of the contact or lead",
      optional: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The lead status of the contact or lead",
      optional: true,
    },
    rating: {
      type: "string",
      label: "Rating",
      description: "The rating of the contact or lead",
      optional: true,
    },
    emailOptOut: {
      type: "string",
      label: "Email Opt Out",
      description: "The email opt-out status of the contact or lead",
      optional: true,
    },
    yahooID: {
      type: "string",
      label: "Yahoo ID",
      description: "The Yahoo ID of the contact or lead",
      optional: true,
    },
    createdTime: {
      type: "string",
      label: "Created Time",
      description: "The created time of the contact or lead (format: MM-DD-YYYY HH:MM:SS)",
      optional: true,
    },
    modifiedTime: {
      type: "string",
      label: "Modified Time",
      description: "The modified time of the contact or lead (format: MM-DD-YYYY HH:MM:SS)",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the contact or lead",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact or lead",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact or lead",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the contact or lead",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact or lead",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the contact or lead",
      optional: true,
    },
    assignedTo: {
      type: "string",
      label: "Assigned To",
      description: "The user to whom the contact or lead is assigned",
      optional: true,
    },
    assignedGroupName: {
      type: "string",
      label: "Assigned Group Name",
      description: "The group to which the contact or lead is assigned",
      optional: true,
    },
    defaultCurrency: {
      type: "string",
      label: "Default Currency",
      description: "The default currency of the contact or lead",
      optional: true,
    },
    leadCustomFields: {
      type: "string[]",
      label: "Lead Custom Fields",
      description: "An array of custom fields for the lead",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      Salutation: this.salutation,
      FirstName: this.firstName,
      LastName: this.lastname,
      Company: this.company,
      Designation: this.designation,
      Phone: this.phone,
      Mobile: this.mobile,
      Fax: this.fax,
      Email: this.email,
      Website: this.website,
      Industry: this.industry,
      SICCode: this.sicCode,
      AnnualRevenue: this.annualRevenue,
      NumberOfEmployees: this.numberOfEmployees,
      ContactType: this.contactType,
      LeadSource: this.leadSource,
      LeadStatus: this.leadStatus,
      Rating: this.rating,
      EmailOptOut: this.emailOptOut,
      YahooID: this.yahooID,
      CreatedTime: this.createdTime,
      ModifiedTime: this.modifiedTime,
      Street: this.street,
      City: this.city,
      State: this.state,
      Zip: this.zip,
      Country: this.country,
      Description: this.description,
      AssignedTo: this.assignedTo,
      AssignedGroupName: this.assignedGroupName,
      DefaultCurrency: this.defaultCurrency,
      LeadCustomFields: this.leadCustomFields
        ? this.leadCustomFields.map(JSON.parse)
        : undefined,
    };

    const response = await this.agiliron.addLead(data);
    $.export("$summary", `Successfully created lead with ID ${response.MCM.parameters.results.message.success_message.lead_id}`);
    return response;
  },
};
