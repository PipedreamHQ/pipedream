import openphone from "../../openphone.app.mjs";

export default {
  key: "openphone-delete-contact",
  name: "Delete Contact",
  description: "Permanently delete a contact by ID. This cannot be undone. Example: call with contactId from **List Contacts** → the contact is removed and the response confirms deletion. [See the documentation](https://www.openphone.com/docs/api-reference/contacts/delete-a-contact)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
    openWorldHint: true,
  },
  props: {
    openphone,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The string identifier of the contact to permanently delete, as returned by the OpenPhone API (e.g. `66d0d87e8dc1211467372303`). Run the **List Contacts** action to find contact IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.openphone.deleteContact({
      contactId: this.contactId,
      $,
    });
    $.export("$summary", `Deleted contact ${this.contactId}`);
    return response;
  },
};
