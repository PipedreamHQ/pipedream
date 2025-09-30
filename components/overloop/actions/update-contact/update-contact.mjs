import overloop from "../../overloop.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "overloop-update-contact",
  name: "Update Contact",
  description: "Creates a new contact. [See the docs](https://apidoc.overloop.com/#update-a-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    firstName: {
      propDefinition: [
        overloop,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        overloop,
        "lastName",
      ],
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
        attributes: pickBy({
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          phone: this.phone,
          lists: this.lists,
          owner_id: this.ownerId,
          organization_id: this.organizationId,
        }),
      },
    };

    const { data: response } = await this.overloop.updateContact(this.contactId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated contact with ID ${response.id}.`);

    return response;
  },
};
