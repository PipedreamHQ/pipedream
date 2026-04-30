import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-add-contact-to-list",
  name: "Add Contact to List",
  description:
    "Adds a contact to a specific static list. [See the documentation](https://developers.hubspot.com/docs/api-reference/crm-lists-v3/memberships/put-crm-v3-lists-listId-memberships-add)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description:
        "The list which the contact will be added to. Only static lists are shown here, as dynamic lists cannot be manually added to.",
    },
    contactId: {
      propDefinition: [
        hubspot,
        "objectId",
        () => ({
          objectType: "contact",
        }),
      ],
      label: "Contact ID",
      description: "The contact to be added to the list",
    },
  },
  async run({ $ }) {
    const {
      list, contactId,
    } = this;
    const response = await this.hubspot.addContactsToList({
      $,
      listId: list.value,
      data: [
        contactId,
      ],
    });
    $.export("$summary", "Successfully added contact to list");
    return response;
  },
};
