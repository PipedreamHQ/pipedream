import app from "../../hackerone.app.mjs";

export default {
  key: "hackerone-create-invitation",
  name: "Create Invitation",
  description: "Invite a recipient to an organization using their email address. [See the documentation](https://api.hackerone.com/customer-resources/?shell#organizations-create-an-invitation)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    organizationAdmin: {
      propDefinition: [
        app,
        "organizationAdmin",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createInvitation({
      $,
      organizationId: this.organizationId,
      data: {
        data: {
          type: "invitation-organization-member",
          attributes: {
            email: this.email,
            organization_admin: this.organizationAdmin,
          },
        },
      },
    });

    $.export("$summary", `Successfully sent invitation to '${this.email}'`);

    return response;
  },
};
