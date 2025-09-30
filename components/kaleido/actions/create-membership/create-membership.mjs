import app from "../../kaleido.app.mjs";

export default {
  key: "kaleido-create-membership",
  name: "Create Membership",
  description: "Create a membership for a consortia in Kaleido. [See the documentation](https://api.kaleido.io/platform.html#tag/Memberships/paths/~1consortia~1{consortia_id}~1memberships/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    consortiaId: {
      propDefinition: [
        app,
        "consortiaId",
      ],
    },
    manageEnvs: {
      propDefinition: [
        app,
        "manageEnvs",
      ],
    },
    inviteOrgs: {
      propDefinition: [
        app,
        "inviteOrgs",
      ],
    },
    createSigners: {
      propDefinition: [
        app,
        "createSigners",
      ],
    },
    multipleMembers: {
      propDefinition: [
        app,
        "multipleMembers",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createMembership({
      $,
      consortiaId: this.consortiaId,
      data: {
        permissions: {
          manage_envs: this.manageEnvs,
          invite_orgs: this.inviteOrgs,
          create_signers: this.createSigners,
          multiple_members: this.multipleMembers,
        },
      },
    });

    $.export("$summary", `Successfully created membership with ID '${response._id}'`);

    return response;
  },
};
