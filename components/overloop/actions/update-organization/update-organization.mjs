import overloop from "../../overloop.app.mjs";
import pickBy from "lodash.pickby";

export default {
  key: "overloop-update-organization",
  name: "Update Organization",
  description: "Updates an organization. [See the docs](https://apidoc.overloop.com/#update-an-organization)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    overloop,
    organizationId: {
      propDefinition: [
        overloop,
        "organizationId",
      ],
      optional: false,
    },
    name: {
      propDefinition: [
        overloop,
        "name",
      ],
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
        attributes: pickBy({
          name: this.name,
          email: this.email,
          phone: this.phone,
          lists: this.lists,
          owner_id: this.ownerId,
        }),
      },
    };

    const { data: response } = await this.overloop.updateOrganization(this.organizationId, {
      data,
      $,
    });

    $.export("$summary", `Successfully updated organization with ID ${response.id}.`);

    return response;
  },
};
