import app from "../../less_annoying_crm.app.mjs";
import { buildContactDetails } from "../../common/utils.mjs";

export default {
  key: "less_annoying_crm-create-contact",
  name: "Create Contact",
  description: "Creates a new contact (person) or company in Less Annoying CRM."
    + " Run **Search Contacts** first to avoid creating a duplicate; company names must be unique."
    + " Set `isCompany` to true to create a company, in which case `contactName` is the company name. For a person, `contactName` is their full name (e.g. `Jane Smith`) and `employer` optionally links/creates their company."
    + " If `assignedTo` is omitted the record is assigned to the API key's owner; use **List Users** to assign someone else."
    + " Returns the new `ContactId`, which is needed for **Create Note**, **Create Task**, and **Create Pipeline Item**."
    + " Use `customFields` for account-specific fields. Common mistake: passing `jobTitle` or `birthday` for a company, which the API does not support."
    + " Example: `contactName: \"Jane Smith\", employer: \"Acme Inc\", emails: [\"jane@acme.com\"], jobTitle: \"VP of Sales\"` returns `{\"ContactId\": \"1234567890123456789012345678901\"}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Contacts#Goto-CreateContact)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    isCompany: {
      type: "boolean",
      label: "Is Company",
      description: "True to create a company, false (default) to create a person.",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "Full name of the person, or the company name when `isCompany` is true.",
    },
    employer: {
      type: "string",
      label: "Employer (Company Name)",
      description: "For a person: the company they work for. Creates the company if it does not exist. Ignored for companies.",
      optional: true,
    },
    assignedTo: {
      propDefinition: [
        app,
        "assignedTo",
      ],
    },
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
    },
    phones: {
      propDefinition: [
        app,
        "phones",
      ],
    },
    websites: {
      propDefinition: [
        app,
        "websites",
      ],
    },
    infoType: {
      propDefinition: [
        app,
        "infoType",
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
    state: {
      propDefinition: [
        app,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        app,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    jobTitle: {
      propDefinition: [
        app,
        "jobTitle",
      ],
    },
    backgroundInfo: {
      propDefinition: [
        app,
        "backgroundInfo",
      ],
    },
    birthday: {
      propDefinition: [
        app,
        "birthday",
      ],
    },
    customFields: {
      propDefinition: [
        app,
        "customFields",
      ],
    },
  },
  async run({ $ }) {
    const isCompany = this.isCompany ?? false;
    const details = buildContactDetails(this);

    // AssignedTo is required by the API; default to the API key's owner.
    if (!details.AssignedTo) {
      const { UserId } = await this.app.getUser({
        $,
      });
      details.AssignedTo = UserId;
    }

    const parameters = {
      IsCompany: isCompany,
      ...details,
    };
    if (isCompany) {
      parameters["Company Name"] = this.contactName;
      delete parameters["Job Title"];
      delete parameters.Birthday;
    } else {
      parameters.Name = this.contactName;
      if (this.employer) parameters["Company Name"] = this.employer;
    }

    const response = await this.app.createContact({
      $,
      parameters,
    });

    $.export("$summary", `Created ${isCompany
      ? "company"
      : "contact"} ${this.contactName} (${response.ContactId})`);
    return response;
  },
};
