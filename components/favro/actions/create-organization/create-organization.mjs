import app from "../../favro.app.mjs";

export default {
  key: "favro-create-organization",
  name: "Create Organization",
  description: "Creates a new organization. [See the documentation](https://favro.com/developer/#create-an-organization)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
      description: "Organization of the user that will be associated with the new organization",

    },
    userId: {
      propDefinition: [
        app,
        "userId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    role: {
      propDefinition: [
        app,
        "role",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createOrganization({
      $,
      data: {
        name: this.name,
        shareToUsers: [
          {
            userId: this.userId,
            role: this.role,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created organization named ${this.name}`);

    return response;
  },
};
