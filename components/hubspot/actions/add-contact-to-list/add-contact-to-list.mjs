import hubspot from "../../hubspot.app.js";

export default {
  key: "hubspot-add-contact-to-list",
  name: "Add Contact to List",
  description: "Adds a contact to a specific static list",
  version: "0.0.1",
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
    const response = await this.hubspot.addContactsToList(list, [
      contactEmail,
    ]);
    $.export("$summary", "Successfully added contact to list");
    return response;
  },
};
