import freshmarketer from "../../freshmarketer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "freshmarketer-find-contact",
  name: "Find Contact",
  description: "Searches for a contact by email and returns contact details if found. [See the documentation](https://developers.freshworks.com/crm/api/#search_contact_by_email)",
  version: "0.0.1",
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
      email: this.contactEmail,
    });

    if (!response || !response.contact || !response.contact.id) {
      throw new Error("Contact not found");
    }

    $.export("$summary", `Successfully found contact with email ${this.contactEmail}`);
    return response.contact;
  },
};
