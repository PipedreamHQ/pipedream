import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-add-contact-to-list",
  name: "Add Contact to List",
  description: "Adds a contact to a specific static list. [See the documentation](https://legacydocs.hubspot.com/docs/methods/lists/add_contact_to_list)",
  version: "0.0.9",
  type: "action",
  props: {
    hubspot,
    list: {
      propDefinition: [
        hubspot,
        "lists",
        () => ({
          listType: "static",
        }),
      ],
      type: "string",
      label: "List",
      description: "The list which the contact will be added to. Only static lists are shown here, as dynamic lists cannot be manually added to.",
    },
    contactEmail: {
      propDefinition: [
        hubspot,
        "contactEmail",
      ],
      description: `The email of the contact to be added to the list. ${hubspot.propDefinitions.contactEmail.description}`,
    },
  },
  async run({ $ }) {
    const {
      list,
      contactEmail,
    } = this;
    const response = await this.hubspot.addContactsToList({
      $,
      listId: list.value,
      data: {
        emails: [
          contactEmail,
        ],
      },
    });
    $.export("$summary", "Successfully added contact to list");
    return response;
  },
};
