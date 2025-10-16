import overloop from "../../overloop.app.mjs";

export default {
  key: "overloop-create-organization",
  name: "Create Organization",
  description: "Creates a new organization. [See the docs](https://apidoc.overloop.com/#create-an-organization)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    name: {
      propDefinition: [
        overloop,
        "name",
      ],
      optional: false,
    },
    email: {
      propDefinition: [
        overloop,
        "email",
      ],
      description: "The organization’s contact email",
    },
    phone: {
      propDefinition: [
        overloop,
        "phone",
      ],
      description: "The organization’s contact phone number",
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
  },
  async run({ $ }) {
    const data = {
      data: {
        type: "organizations",
        attributes: {
          name: this.name,
          email: this.email,
          phone: this.phone,
          lists: this.lists,
          owner_id: this.ownerId,
        },
      },
    };

    const { data: response } = await this.overloop.createOrganization({
      data,
      $,
    });

    $.export("$summary", `Successfully created organization with ID ${response.id}.`);

    return response;
  },
};
