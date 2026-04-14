import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-add-contact-to-list",
  name: "Add Contact to List",
  description:
    "Adds a contact to a specific static list. [See the documentation](https://developers.hubspot.com/docs/api-reference/latest/crm/lists/guide#add-records-to-an-existing-list)",
  version: "0.0.31",
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
      list, contactEmail,
    } = this;

    const listId = typeof list === "object"
      ? list.value
      : list;

    const { results } = await this.hubspot.searchCRM({
      object: "contacts",
      $,
      data: {
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: contactEmail,
              },
            ],
          },
        ],
        limit: 1,
      },
    });

    if (!results?.length) {
      throw new Error(`Contact with email "${contactEmail}" not found in HubSpot. The contact must exist before being added to a list.`);
    }

    const recordId = results[0].id;

    const response = await this.hubspot.makeRequest({
      api: "/crm/v3",
      endpoint: `/lists/${listId}/memberships/add`,
      method: "PUT",
      $,
      data: [
        recordId,
      ],
    });

    $.export("$summary", `Successfully added contact (${contactEmail}) to list`);
    return response;
  },
};
