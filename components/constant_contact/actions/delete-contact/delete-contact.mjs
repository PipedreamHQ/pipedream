import constantContact from "../../constant_contact.app.mjs";

export default {
  key: "constant_contact-delete-contact",
  name: "Remove Contact",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Delete a specific contact identified by contact_id. [See the documentation](https://developer.constantcontact.com/api_reference/index.html#!/Contacts/deleteContact)",
  type: "action",
  props: {
    constantContact,
    contactId: {
      propDefinition: [
        constantContact,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const {
      constantContact,
      contactId,
    } = this;

    const response = await constantContact.deleteContact({
      $,
      contactId,
    });

    $.export("$summary", `The contact with id: ${contactId} was successfully deleted!`);
    return response;
  },
};
