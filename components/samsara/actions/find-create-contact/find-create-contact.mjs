import samsara from "../../samsara.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "samsara-find-create-contact",
  name: "Find or Create Contact",
  description: "Searches for a contact within the organization using the provided props like contact name or email. If the contact does not exist, it will create a new one.",
  version: "0.0.1",
  type: "action",
  props: {
    samsara,
    contactNameOrEmail: {
      propDefinition: [
        samsara,
        "contactNameOrEmail",
      ],
    },
    firstName: {
      propDefinition: [
        samsara,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        samsara,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        samsara,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        samsara,
        "phoneNumber",
      ],
    },
  },
  async run({ $ }) {
    // Try to find the contact first
    let contact = await this.samsara.searchOrCreateContact({
      contactNameOrEmail: this.contactNameOrEmail,
    });

    if (!contact || Object.keys(contact).length === 0) {
      // If contact is not found or the returned object is empty, create a new contact
      if (!this.firstName || !this.lastName || !this.email || !this.phoneNumber) {
        throw new Error("To create a contact, first name, last name, email, and phone number must be provided.");
      }

      contact = await this.samsara.createContact({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        phoneNumber: this.phoneNumber,
      });

      $.export("$summary", `Created new contact: ${contact.firstName} ${contact.lastName}`);
    } else {
      $.export("$summary", `Found contact: ${contact.firstName} ${contact.lastName}`);
    }

    return contact;
  },
};
