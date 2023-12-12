import godial from "../../app/godial.app.mjs";

export default {
  name: "Add Contact",
  version: "0.0.1",
  key: "godial-add-contact",
  description: "Adds a contact. [See docs here](https://godial.stoplight.io/docs/godial/b3A6MzAzMTY2Mg-contact-add)",
  type: "action",
  props: {
    godial,
    listId: {
      propDefinition: [
        godial,
        "listId",
      ],
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the contact to add",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact to add",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact to add",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.godial.addContact({
      $,
      data: {
        listId: this.listId,
        name: this.name,
        email: this.email,
        phone: this.phone,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added contact with ID ${response.id}`);
    }

    return response;
  },
};
