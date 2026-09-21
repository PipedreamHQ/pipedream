import {
  normalizeNameValueList, parseObject,
} from "../../common/utils.mjs";
import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-update-contact",
  name: "Update Contact",
  description: "Update one or more fields on an existing contact. Only the fields you provide are changed; omitted fields are left as-is. Run **List Contacts** to find a contactId. Example: call with contactId from **List Contacts** and company=\"Acme Corp\" → updates just the company field and returns the updated contact record. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/update-a-contact-by-id)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    openphone,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact. Run the **List Contacts** action to find contact IDs.",
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
    const response = await this.openphone.updateContact({
      $,
      contactId: this.contactId,
      data: {
        defaultFields: {
          firstName: this.firstName,
          lastName: this.lastName,
          company: this.company,
          role: this.role,
          emails: normalizeNameValueList(parseObject(this.emails), "Email"),
          phoneNumbers: normalizeNameValueList(parseObject(this.phoneNumbers), "Phone"),
        },
        customFields: parseObject(this.customFields),
      },
    });

    $.export("$summary", `Successfully updated contact with ID ${this.contactId}`);
    return response;
  },
};
