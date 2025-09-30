import freshmarketer from "../../freshmarketer.app.mjs";

export default {
  key: "freshmarketer-find-contact",
  name: "Find Contact",
  description: "Searches for a contact by email and returns contact details if found. [See the documentation](https://developers.freshworks.com/crm/api/#search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    freshmarketer,
    contactEmail: {
      propDefinition: [
        freshmarketer,
        "contactEmail",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshmarketer.searchContactByEmail({
      $,
      data: {
        filter_rule: [
          {
            attribute: "contact_email.email",
            operator: "is_in",
            value: this.contactEmail,
          },
        ],
      },
    });

    if (!response.contacts.length) {
      throw new Error("Contact not found");
    }

    $.export("$summary", `Successfully found contact with email ${this.contactEmail}`);
    return response.contacts[0];
  },
};
