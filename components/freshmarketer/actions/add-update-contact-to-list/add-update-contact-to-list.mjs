import freshmarketer from "../../freshmarketer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "freshmarketer-add-update-contact-to-list",
  name: "Add or Update Contact to List",
  description: "Adds a new contact or updates an existing one on a specific list. Requires contact details and list ID as props.",
  version: "0.0.1",
  type: "action",
  props: {
    freshmarketer,
    listId: freshmarketer.propDefinitions.listId,
    contactDetails: freshmarketer.propDefinitions.contactDetails,
  },
  async run({ $ }) {
    const contactSearchResult = await this.freshmarketer.searchContactByEmail({
      email: this.contactDetails.email,
    });
    let response;
    if (contactSearchResult && contactSearchResult.contact && contactSearchResult.contact.id) {
      // Update existing contact
      response = await this.freshmarketer.updateContact({
        contactDetails: this.contactDetails,
      });
      $.export("$summary", `Updated contact ${this.contactDetails.email} successfully`);
    } else {
      // Add new contact to list
      response = await this.freshmarketer.addContactToList({
        listId: this.listId,
        contactDetails: this.contactDetails,
      });
      $.export("$summary", `Added new contact ${this.contactDetails.email} to list ${this.listId} successfully`);
    }
    return response;
  },
};
