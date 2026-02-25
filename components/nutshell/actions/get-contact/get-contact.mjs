import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-get-contact",
  name: "Get Contact",
  description: "Get a contact by ID. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#ae2873af072fb636ea2eae1403653da8e)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact to retrieve.",
    },
  },
  async run({ $ }) {
    const contact = await this.nutshell.getContact({
      $,
      contactId: this.contactId,
    });
    $.export("$summary", `Successfully retrieved contact "${contact?.name.displayName ?? this.contactId}"`);
    return this.nutshell.formatContact(contact);
  },
};
