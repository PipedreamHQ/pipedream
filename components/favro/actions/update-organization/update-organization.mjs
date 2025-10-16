import app from "../../favro.app.mjs";

export default {
  key: "favro-update-organization",
  name: "Update Organization",
  description: "Updates an existing organization. [See the documentation](https://favro.com/developer/#update-an-organization)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    const response = await this.app.updateOrganization({
      $,
      organizationId: this.organizationId,
      headers: {
        organizationId: this.organizationId,
      },
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

    $.export("$summary", `Successfully updated organization with ID '${this.organizationId}'`);

    return response;
  },
};
