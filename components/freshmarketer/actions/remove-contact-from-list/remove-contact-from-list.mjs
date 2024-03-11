import freshmarketer from "../../freshmarketer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "freshmarketer-remove-contact-from-list",
  name: "Remove Contact From List",
  description: "Removes a contact from a specific list by email or contact ID. Requires contact's email or ID and list ID as props. [See the documentation](https://developers.freshworks.com/crm/api/)",
  version: "0.0.1",
  type: "action",
  props: {
    freshmarketer,
    listId: freshmarketer.propDefinitions.listId,
    contactId: freshmarketer.propDefinitions.contactId,
    contactEmail: freshmarketer.propDefinitions.contactEmail,
  },
  async run({ $ }) {
    if (!this.contactId && !this.contactEmail) {
      throw new Error("You must provide either a Contact ID or a Contact Email.");
    }

    let contactId = this.contactId;

    // If contactEmail is provided, search for the contact by email to get the ID
    if (!contactId && this.contactEmail) {
      const searchResponse = await this.freshmarketer.searchContactByEmail({
        email: this.contactEmail,
      });
      if (searchResponse && searchResponse.contact && searchResponse.contact.id) {
        contactId = searchResponse.contact.id;
      } else {
        throw new Error("Contact not found with the provided email.");
      }
    }

    // Proceed to remove the contact from the list
    const response = await this.freshmarketer.removeContactFromList({
      listId: this.listId,
      contactId,
    });

    $.export("$summary", `Successfully removed contact from list ${this.listId}`);

    return response;
  },
};
