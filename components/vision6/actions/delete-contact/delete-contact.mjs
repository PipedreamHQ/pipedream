import vision6 from "../../vision6.app.mjs";

export default {
  key: "vision6-delete-contact",
  name: "Delete Contact",
  description: "Delete a contact. [See the docs here](https://api.vision6.com/#delete-contacts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vision6,
    list: {
      propDefinition: [
        vision6,
        "list",
      ],
    },
    contact: {
      propDefinition: [
        vision6,
        "contact",
        (c) => ({
          listId: c.list,
        }),
      ],
      description: "Select the contact to delete",
    },
  },
  async run({ $ }) {
    await this.vision6.deleteContact(this.list, this.contact, {
      $,
    });
    $.export("$summary", `Successfully deleted contact with ID ${this.contact}`);
    // nothing to return
  },
};
