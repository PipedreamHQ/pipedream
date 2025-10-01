import app from "../../hackerone.app.mjs";

export default {
  key: "hackerone-create-group",
  name: "Create Group",
  description: "Create a new organization group. [See the documentation](https://api.hackerone.com/customer-resources/?javascript#organizations-create-group)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    permissions: {
      propDefinition: [
        app,
        "permissions",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createGroup({
      $,
      organizationId: this.organizationId,
      data: {
        data: {
          type: "organization-member-group",
          attributes: {
            name: this.name,
            permissions: this.permissions,
          },
        },
      },
    });

    $.export("$summary", `Successfully created the group '${response.data.attributes.name}'`);

    return response;
  },
};
