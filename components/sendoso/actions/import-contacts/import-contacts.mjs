import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-import-contacts",
  name: "Import Contacts",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Bulk import contacts into Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    contacts: {
      type: "string[]",
      label: "Contacts Data",
      description: "Array of contact objects to import (JSON format). Each object should contain fields like first_name, last_name, email, etc.",
    },
  },
  async run({ $ }) {
    const { contacts } = this;

    // Parse contacts: handle string[], single string (JSON), or array
    let contactsArray;
    if (Array.isArray(contacts)) {
      // If it's already an array, check if items are strings that need parsing
      contactsArray = contacts.map((contact) => 
        typeof contact === "string" ? JSON.parse(contact) : contact,
      );
    } else if (typeof contacts === "string") {
      // If it's a single JSON string
      contactsArray = JSON.parse(contacts);
    } else {
      contactsArray = contacts;
    }

    const response = await this.sendoso.importContacts({
      $,
      contacts: contactsArray,
    });

    const imported = response.imported || response.count || (Array.isArray(contactsArray) ? contactsArray.length : 0);
    $.export("$summary", `Successfully imported ${imported} contact(s)`);
    return response;
  },
};

