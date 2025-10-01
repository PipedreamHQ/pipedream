import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-update-contact",
  name: "Update Contact",
  description: "Update a contact in Freshdesk. [See the documentation](https://developers.freshdesk.com/api/#update_contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshdesk,
    contactId: {
      propDefinition: [
        freshdesk,
        "contactId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Primary email address of the contact",
      optional: true,
    },
    otherEmails: {
      type: "string[]",
      label: "Additional Email Addresses",
      description: "One or more additional email addresses for the contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
      optional: true,
    },
    companyId: {
      propDefinition: [
        freshdesk,
        "companyId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.freshdesk.updateContact({
      $,
      contactId: this.contactId,
      data: {
        name: this.name,
        email: this.email,
        other_emails: this.otherEmails,
        phone: this.phone,
        company_id: this.companyId,
      },
    });
    $.export("$summary", `Contact successfully updated: ${response.name}`);
    return response;
  },
};
