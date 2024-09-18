import theBookie from "../../the_bookie.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "the_bookie-find-or-create-contact",
  name: "Find or Create Contact",
  description: "Searches for a contact from the address book. If not found, creates a new contact. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    theBookie,
    addressBookId: {
      propDefinition: [
        theBookie,
        "addressBookId",
      ],
    },
    name: {
      propDefinition: [
        theBookie,
        "name",
      ],
    },
    email: {
      propDefinition: [
        theBookie,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        theBookie,
        "phoneNumber",
      ],
    },
    address: {
      propDefinition: [
        theBookie,
        "address",
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        theBookie,
        "notes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const contact = await this.theBookie.searchCreateContact({
      addressBookId: this.addressBookId,
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      address: this.address,
      notes: this.notes,
    });

    $.export("$summary", `Contact ${contact.name
      ? contact.name
      : "created"} successfully`);
    return contact;
  },
};
