import onepagecrm from "../../onepagecrm.app.mjs";

export default {
  key: "onepagecrm-delete-contact",
  name: "Delete Contact",
  description: "Deletes an existing contact from OnePageCRM. [See the documentation](https://developer.onepagecrm.com/api/#/Contacts/delete_contacts__contact_id_)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    onepagecrm,
    contactId: {
      propDefinition: [
        onepagecrm,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.onepagecrm.deleteContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully deleted contact with ID ${this.contactId}`);
    return response;
  },
};
