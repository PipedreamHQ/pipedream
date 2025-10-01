import campayn from "../../campayn.app.mjs";

export default {
  key: "campayn-get-contact",
  name: "Get Contact",
  description: "Retrieves an existing contact. [See the docs](https://github.com/nebojsac/Campayn-API/blob/master/endpoints/contacts.md#get-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    campayn,
    listId: {
      propDefinition: [
        campayn,
        "listId",
      ],
    },
    contactId: {
      propDefinition: [
        campayn,
        "contactId",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {

    const response = await this.campayn.getContact(this.contactId, {
      $,
    });

    $.export("$summary", `Successfully retrieved contact with ID ${this.contactId}.`);

    return response;
  },
};
