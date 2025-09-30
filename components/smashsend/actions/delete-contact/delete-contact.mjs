import smashsend from "../../smashsend.app.mjs";

export default {
  key: "smashsend-delete-contact",
  name: "Delete Contact",
  description: "Delete a contact. [See the documentation](https://smashsend.com/docs/api/contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smashsend,
    contactId: {
      propDefinition: [
        smashsend,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smashsend.deleteContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully deleted contact ${this.contactId}`);
    return response;
  },
};
