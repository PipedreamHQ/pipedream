import { ConfigurationError } from "@pipedream/platform";
import agiliron from "../../agiliron.app.mjs";
import constants from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "agiliron-create-lead",
  name: "Create Lead",
  description: "Establishes a new lead within Agiliron. [See the documentation](https://api.agiliron.com/docs/add-lead-1)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string",
      label: "Company",
      description: "The company of the lead",
    },
    salutation: {
      propDefinition: [
        agiliron,
        "salutation",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        agiliron,
        "firstName",
      ],
      optional: true,
    },
    designation: {
      type: "string",
      label: "Designation",
      description: "The designation of the lead",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the lead",
      optional: true,
    },
    mobile: {
      propDefinition: [
        agiliron,
        "mobile",
      ],
      optional: true,
    },
    fax: {
      propDefinition: [
        agiliron,
        "fax",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        agiliron,
        "email",
      ],
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the lead. Without http:// or https://",
      optional: true,
    },
    industry: {
      type: "string",
      label: "Industry",
      description: "The industry of the lead",
      options: constants.INDUSTRY_OPTIONS,
      optional: true,
    },
    sicCode: {
      type: "string",
      label: "SIC Code",
      description: "The SIC code of the lead",
      optional: true,
    },
    annualRevenue: {
      type: "string",
      label: "Annual Revenue",
      description: "The annual revenue of the lead. **(US Dollar : $)**",
      optional: true,
    },
    numberOfEmployees: {
      type: "string",
      label: "Number of Employees",
      description: "The number of employees of the lead",
      optional: true,
    },
    contactType: {
      propDefinition: [
        agiliron,
        "contactType",
      ],
      optional: true,
    },
    leadSource: {
      propDefinition: [
        agiliron,
        "leadSource",
      ],
      optional: true,
    },
    leadStatus: {
      type: "string",
      label: "Lead Status",
      description: "The lead status of the lead",
      options: constants.LEAD_STATUS_OPTIONS,
      optional: true,
    },
    rating: {
      type: "string",
      label: "Rating",
      description: "The rating of the lead",
      options: constants.RATING_OPTIONS,
      optional: true,
    },
    emailOptOut: {
      propDefinition: [
        agiliron,
        "emailOptOut",
      ],
      optional: true,
    },
    yahooId: {
      propDefinition: [
        agiliron,
        "yahooId",
      ],
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street address of the lead",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the lead",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the lead",
      optional: true,
    },
    zip: {
      type: "string",
      label: "Zip",
      description: "The zip code of the lead",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the lead",
      optional: true,
    },
    description: {
      propDefinition: [
        agiliron,
        "description",
      ],
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        agiliron,
        "assignedTo",
      ],
      optional: true,
    },
    assignedGroupName: {
      type: "string",
      label: "Assigned Group Name",
      description: "The group to which the contact or lead is assigned",
      options: constants.ASSIGNED_TO_GROUP_OPTIONS,
      optional: true,
    },
    customFields: {
      propDefinition: [
        agiliron,
        "customFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.assignedTo && this.assignedGroupName) {
      throw new ConfigurationError("You must provite either Assigned To or Assigned to Group Name");
    }
    const parsedCustomFields = parseObject(this.customFields);
    const leadCustomFields = parsedCustomFields && Object.keys(parsedCustomFields).map((key) => ({
      Name: key,
      value: parsedCustomFields[key],
    }));

    const lead = {
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
      YahooID: this.yahooId,
      Street: this.street,
      City: this.city,
      State: this.state,
      Zip: this.zip,
      Country: this.country,
      Description: this.description,
      AssignedTo: this.assignedTo,
      AssignedGroupName: this.assignedGroupName,
      DefaultCurrency: "USD",
      LeadCustomFields: {
        CustomField: leadCustomFields,
      },
    };

    const response = await this.agiliron.addLead({
      $,
      data: {
        Leads: {
          Lead: lead,
        },
      },
    });

    $.export("$summary", `Successfully created lead with ID ${response?.MCM?.parameters?.results?.message?.success_message?.lead_id}`);
    return response;
  },
};
