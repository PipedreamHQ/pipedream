import sendinBlueApp from "../../sendinblue.app.mjs";

// legacy_hash_id: a_0Mi7n5
export default {
  key: "sendinblue-add-or-update-contact",
  name: "Add or Updated a contact",
  description: "Add or Updated a contact and list",
  version: "0.0.49",
  type: "action",
  props: {
    sendinBlueApp,
    email: {
      type: "string",
      label: "Contact Identifier (Email)",
      description: "Email of the contact, it will be used to search the contact, if it can be found the contact will be updated else it will be inserted",
    },
    attributes: {
      type: "object",
      label: "Attributes",
      description: "Contact's attributes to be either inserted or updated on attributes",
      default: {
        "NAME": "John Doe",
        "EMAIL": "john@doe.com",
        "SMS": "+91XXXXXXXXXX",
      },
    },
    listIds: {
      type: "string[]",
      label: "List Identifiers",
      description: "Array of Lists identifiers (ListId) to be either inserted or updated,\n\n**On update the contact will be removed from previous lists**",
      async options({ prevContext }) {
        return this.sendinBlueApp.getListsPaginated(prevContext);
      },
    },
  },
  async run({ $ }) {
    const listIds = Object.keys(this.listIds).map((key) => parseInt(this.listIds[key], 10));
    const encodedIdentifier = encodeURIComponent(this.email);
    const contact = await this.sendinBlueApp.existingContactByIdentifier(
      $,
      encodedIdentifier,
    );
    if (contact) {
      const unlinkListIds = contact.listIds.filter((el) => !listIds.includes(el));
      await this.sendinBlueApp.updateContact(
        $,
        encodedIdentifier,
        this.attributes,
        listIds,
        unlinkListIds,
      );
      $.export("$summary", `Successfully updated contact "${this.email}"`);
    } else {
      await this.sendinBlueApp.addContact(
        $,
        this.attributes,
        listIds,
      );
      $.export("$summary", `Successfully inserted contact "${this.email}"`);
    }
    return this.sendinBlueApp.existingContactByIdentifier(
      $,
      encodeURIComponent(this.attributes.EMAIL || this.email),
    );
  },
};
