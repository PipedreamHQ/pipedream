import vision6 from "../../vision6.app.mjs";

export default {
  key: "vision6-deactivate-contact",
  name: "Deactivate Contact",
  description: "Deactivate an existing contact. [See the docs here](https://api.vision6.com/#update-contacts)",
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
          params: {
            is_active: true,
          },
        }),
      ],
    },
  },
  async run({ $ }) {
    const data = {
      contacts: [
        {
          id: this.contact,
          is_active: false,
        },
      ],
    };
    await this.vision6.updateContact(this.list, {
      data,
      $,
    });
    $.export("$summary", `Successfully deactivated contact with ID ${this.contact}`);
    // nothing to return
  },
};
