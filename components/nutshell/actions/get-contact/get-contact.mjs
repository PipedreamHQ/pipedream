import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-get-contact",
  name: "Get Contact",
  description: "Retrieve a single contact (person) from Nutshell. [See the documentation](https://developers.nutshell.com/reference/8a291bf9a1a7e4a7fd1ca0cabfdaa8a7)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    contactId: {
      propDefinition: [
        nutshell,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const contact = await this.nutshell.getContact({
      $,
      contactId: this.contactId,
    });

    const displayName = typeof contact?.name === "object"
      ? (contact.name?.displayName
        || [
          contact.name?.givenName,
          contact.name?.familyName,
        ].filter(Boolean).join(" ")
        || this.contactId)
      : (contact?.name ?? this.contactId);

    $.export("$summary", `Successfully retrieved contact "${displayName}"`);
    return this.nutshell.formatContact(contact);
  },
};
