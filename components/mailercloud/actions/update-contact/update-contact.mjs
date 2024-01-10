import mailercloud from "../../mailercloud.app.mjs";

export default {
  key: "mailercloud-update-contact",
  name: "Update Contact",
  description: "Update an existing contact in the user's Mailercloud account.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    mailercloud,
    contactId: {
      propDefinition: [
        mailercloud,
        "contactId",
      ],
    },
    newContactDetails: {
      propDefinition: [
        mailercloud,
        "newContactDetails",
      ],
    },
    contactAttributes: {
      propDefinition: [
        mailercloud,
        "contactAttributes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mailercloud.updateContact(
      this.contactId,
      this.newContactDetails,
      this.contactAttributes,
    );
    $.export("$summary", `Successfully updated contact with ID: ${this.contactId}`);
    return response;
  },
};
