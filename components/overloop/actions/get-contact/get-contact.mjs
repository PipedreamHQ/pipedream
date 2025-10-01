import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-get-contact",
  name: "Get Contact",
  description: "Retrieves a contact by id. [See the docs](https://apidoc.overloop.com/#retrieve-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    overloop,
    contactId: {
      propDefinition: [
        overloop,
        "contactId",
      ],
    },
  },
  async run({ $ }) {
    const { data: response } = await this.overloop.getContact(this.contactId, {
      $,
    });

    $.export("$summary", `Successfully retrieved contact with ID ${response.id}.`);

    return response;
  },
};
