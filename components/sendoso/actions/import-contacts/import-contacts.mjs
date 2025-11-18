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

    // Parse contacts if they're strings
    const contactsArray = typeof contacts === "string" ?
      JSON.parse(contacts) :
      contacts;

    const response = await this.sendoso.importContacts({
      $,
      contacts: contactsArray,
    });

    const imported = response.imported || response.count || contactsArray.length;
    $.export("$summary", `Successfully imported ${imported} contact(s)`);
    return response;
  },
};

