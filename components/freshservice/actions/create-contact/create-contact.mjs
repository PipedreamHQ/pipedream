import { ConfigurationError } from "@pipedream/platform";
import freshservice from "../../freshservice.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "freshservice-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Freshservice. [See the documentation](https://api.freshservice.com/v2/#create_requester)",
  version: "0.0.1",
  type: "action",
  props: {
    freshservice,
    first_name: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    last_name: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Primary email address of the contact",
      optional: true,
    },
    secondary_emails: {
      type: "string[]",
      label: "Secondary Emails",
      description: "Additional email addresses of the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the contact",
      optional: true,
    },
    mobile: {
      type: "string",
      label: "Mobile",
      description: "Mobile number of the contact",
      optional: true,
    },
    job_title: {
      type: "string",
      label: "Job Title",
      description: "Job title of the contact",
      optional: true,
    },
    department_id: {
      type: "string",
      label: "Department ID",
      description: "Department ID of the contact",
      optional: true,
    },
    company_id: {
      propDefinition: [
        freshservice,
        "companyId",
      ],
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the contact",
      optional: true,
    },
    time_zone: {
      type: "string",
      label: "Time Zone",
      description: "Time zone of the contact",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Language of the contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      secondary_emails,
      ...otherProps
    } = this;

    if (!this.email && !this.phone) {
      throw new ConfigurationError("Either email or phone must be provided");
    }

    const data = removeNullEntries(otherProps);
    
    if (secondary_emails && secondary_emails.length > 0) {
      data.secondary_emails = secondary_emails;
    }

    const response = await this.freshservice.createContact({
      data,
      $,
    });

    $.export("$summary", `Successfully created contact: ${response.requester?.first_name} ${response.requester?.last_name || ""}`);
    return response;
  },
};