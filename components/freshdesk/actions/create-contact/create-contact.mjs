import freshdesk from "../../freshdesk.app.mjs";

export default {
  key: "freshdesk-create-contact",
  name: "Create a Contact",
  description: "Create a contact. [See the documentation](https://developers.freshdesk.com/api/#create_contact)",
  version: "0.1.0",
  type: "action",
  props: {
    freshdesk,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the contact.",
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
    const {
      companyId, otherEmails, ...data
    } = this;
    const response = await this.freshdesk.createContact({
      $,
      data: {
        other_emails: otherEmails,
        company_id: companyId && Number(companyId),
        ...data,
      },
    });
    response && $.export("$summary", "Contact successfully created");
    return response;
  },
};
