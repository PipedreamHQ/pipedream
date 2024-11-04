import openphone from "../../openphone.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "openphone-create-contact",
  name: "Create Contact",
  description: "Create a new contact in OpenPhone. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/create-a-contact)",
  version: "0.0.1",
  type: "action",
  props: {
    openphone,
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company name.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "The contact's role.",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Array of contact's emails.",
      optional: true,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of contact's phone numbers.",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom fields for the contact.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      role: this.role,
      emails: this.emails,
      phoneNumbers: this.phoneNumbers,
      customFields: this.customFields,
    };

    const response = await this.openphone.createContact(data);

    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
