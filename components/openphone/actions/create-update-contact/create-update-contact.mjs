import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-update-contact",
  name: "Update Contact",
  description: "Update an existing contact on OpenPhone. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/update-a-contact-by-id)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    openphone,
    contactId: {
      propDefinition: [
        openphone,
        "contactId",
      ],
    },
    firstName: {
      propDefinition: [
        openphone,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        openphone,
        "lastName",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        openphone,
        "company",
      ],
      optional: true,
    },
    role: {
      propDefinition: [
        openphone,
        "role",
      ],
      optional: true,
    },
    emails: {
      propDefinition: [
        openphone,
        "emails",
      ],
      optional: true,
    },
    phoneNumbers: {
      propDefinition: [
        openphone,
        "phoneNumbers",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        openphone,
        "customFields",
      ],
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

    const response = await this.openphone.updateContact(this.contactId, data);

    $.export("$summary", `Successfully updated contact with ID ${this.contactId}`);
    return response;
  },
};
