import drift from "../../drift.app.mjs";

export default {
  key: "drift-delete-contact-test",
  name: "Delete Contact",
  description: "Deletes a contact in Drift by ID or email. [See the docs](https://devdocs.drift.com/docs/removing-a-contact).",
  version: "0.0.12",
  type: "action",
  props: {
    drift,
    emailOrId: {
      type: "string",
      label: "Email or Id",
      description: "The contact's email address or ID",
    },
  },

  async run({ $ }) {

    const warnings = [];

    const { drift } = this;

    const emailOrId = drift.trimIfString(this.emailOrId);

    warnings.push(...drift.checkEmailOrId(emailOrId));

    let contact = await drift.getContactByEmailOrId($, emailOrId);
    contact = contact.data[0] || contact.data;

    const contactId = contact.id;
    const contactEmail = contact.email;

    const response = await drift.deleteContactById({
      $,
      contactId,
    });

    $.export("$summary", `Contact ${contactEmail} ID "${contactId}" deleted successfully.`);

    return response;
  },
};

