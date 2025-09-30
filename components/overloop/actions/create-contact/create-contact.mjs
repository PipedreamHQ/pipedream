import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-create-contact",
  name: "Create Contact",
  description: "Creates a new contact. [See the docs](https://apidoc.overloop.com/#create-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    firstName: {
      propDefinition: [
        overloop,
        "firstName",
      ],
      optional: false,
    },
    lastName: {
      propDefinition: [
        overloop,
        "lastName",
      ],
      optional: false,
    },
    email: {
      propDefinition: [
        overloop,
        "email",
      ],
    },
    phone: {
      propDefinition: [
        overloop,
        "phone",
      ],
    },
    lists: {
      propDefinition: [
        overloop,
        "listNames",
      ],
    },
    ownerId: {
      propDefinition: [
        overloop,
        "userId",
      ],
      label: "Owner ID",
    },
    organizationId: {
      propDefinition: [
        overloop,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "contacts",
        attributes: {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone: this.phone,
          lists: this.lists,
          owner_id: this.ownerId,
          organization_id: this.organizationId,
        },
      },
    };

    const { data: response } = await this.overloop.createContact({
      data,
      $,
    });

    $.export("$summary", `Successfully created contact with ID ${response.id}.`);

    return response;
  },
};
